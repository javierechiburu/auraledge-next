import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/lib/api/mercadopago";
import { verifyMercadoPagoSignature } from "@/lib/api/mercadopago-signature";
import { getOrder, updateOrder } from "@/lib/api/strapi";
import { fulfillOrder } from "@/lib/api/fulfillment";
import { OrderStatus } from "@/lib/types";

const STATUS_MAP: Record<string, OrderStatus> = {
  approved: "approved",
  rejected: "rejected",
  cancelled: "cancelled",
  pending: "pending",
  in_process: "pending",
};

// DIAGNÓSTICO temporal (QUITAR después): guarda el resultado de la última
// notificación procesada para poder leerlo con GET sin acceder a los logs. En
// serverless puede perderse si la lambda se recicla, pero suele sobrevivir unos
// minutos en instancias "calientes" — suficiente para inspeccionar tras un pago.
let lastWebhookRun: Record<string, unknown> | null = null;

/**
 * Notificación de pago de Mercado Pago (configurar como notification_url).
 * Docs: https://www.mercadopago.com/developers/es/docs/checkout-pro/additional-content/notifications/webhooks
 *
 * SEGURIDAD:
 *  1. Se valida la firma HMAC (`x-signature`) antes de procesar. Sin firma
 *     válida se rechaza (evita que un tercero marque órdenes como pagadas).
 *  2. El estado del pago se obtiene consultando la API de Mercado Pago con el
 *     `paymentId` (no se confía en el body de la notificación).
 *  3. La entrega digital (correo con link firmado) se dispara SOLO cuando el
 *     pago está aprobado y la orden no había sido entregada antes (idempotente).
 */
/**
 * DIAGNÓSTICO temporal (QUITAR después). Abre esta URL en el navegador
 * (GET https://geniomusic.com/api/webhooks/mercadopago) para confirmar qué
 * variables de entorno llegaron al deploy, SIN exponer sus valores. Sirve para
 * distinguir "variable ausente" de "valor incorrecto" sin acceder a los logs.
 */
export async function GET() {
  return NextResponse.json({
    diag: "webhook-config",
    nodeEnv: process.env.NODE_ENV ?? null,
    mpWebhookSecret: {
      set: Boolean(process.env.MP_WEBHOOK_SECRET),
      len: (process.env.MP_WEBHOOK_SECRET || "").length,
    },
    mpAccessToken: {
      set: Boolean(process.env.MP_ACCESS_TOKEN),
      // Los tokens de prueba empiezan por TEST-, los de prod por APP_USR-.
      prefix: (process.env.MP_ACCESS_TOKEN || "").slice(0, 5) || null,
    },
    resendApiKey: { set: Boolean(process.env.RESEND_API_KEY) },
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    lastWebhookRun,
  });
}

export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const body = await request.json().catch(() => null);

  const type = searchParams.get("type") ?? body?.type;
  const paymentId = searchParams.get("data.id") ?? body?.data?.id;

  // Verificación de firma
  const signatureState = verifyMercadoPagoSignature({
    xSignature: request.headers.get("x-signature"),
    xRequestId: request.headers.get("x-request-id"),
    dataId: searchParams.get("data.id") ?? (paymentId != null ? String(paymentId) : null),
    secret: process.env.MP_WEBHOOK_SECRET,
  });

  // --- DIAGNÓSTICO temporal de firma (no expone el secreto; quitar después) ---
  // Se devuelve en la respuesta para poder verlo en el panel de MP (detalle de
  // la entrega) sin necesidad de los logs de Netlify.
  const debug: Record<string, unknown> = {
    at: new Date().toISOString(),
    url: request.url,
    queryDataId: searchParams.get("data.id"),
    bodyDataId: body?.data?.id ?? null,
    dataIdUsed: searchParams.get("data.id") ?? (paymentId != null ? String(paymentId) : null),
    xSignature: request.headers.get("x-signature"),
    xRequestId: request.headers.get("x-request-id"),
    secretSet: Boolean(process.env.MP_WEBHOOK_SECRET),
    secretLen: (process.env.MP_WEBHOOK_SECRET || "").length,
    signatureState,
    outcome: "started",
  };
  lastWebhookRun = debug; // se muta debajo; GET lee el estado final por referencia.
  console.log("[webhook-debug] " + JSON.stringify(debug));
  // --- fin diagnóstico ---

  if (signatureState === "invalid") {
    console.warn("[webhooks/mercadopago] Firma inválida — notificación rechazada.");
    debug.outcome = "rejected_invalid_signature";
    // Devuelve 200 para que MP muestre el cuerpo de la respuesta con el debug
    // (con 401 el panel a veces no muestra el body). QUITAR tras diagnosticar.
    return NextResponse.json({ error: "invalid signature", debug }, { status: 200 });
  }
  if (signatureState === "unconfigured") {
    // Sin secreto configurado: en producción se rechaza; en dev se permite con aviso.
    if (process.env.NODE_ENV === "production") {
      console.error("[webhooks/mercadopago] MP_WEBHOOK_SECRET no configurado en producción.");
      return NextResponse.json({ error: "webhook secret not configured" }, { status: 401 });
    }
    console.warn(
      "[webhooks/mercadopago] MP_WEBHOOK_SECRET no configurado — firma NO verificada (solo dev)."
    );
  }

  if (type !== "payment" || !paymentId) {
    debug.outcome = "ignored_non_payment";
    return NextResponse.json({ received: true, debug });
  }

  try {
    const payment = await getPayment(String(paymentId));
    const orderId = payment.external_reference;
    const status = STATUS_MAP[payment.status ?? "pending"] ?? "pending";
    debug.paymentStatus = payment.status ?? null;
    debug.mappedStatus = status;
    debug.orderId = orderId ?? null;

    if (orderId) {
      // Captura de comisión de MP para reportar bruto vs neto.
      const pAny = payment as unknown as {
        fee_details?: Array<{ amount?: number }>;
        transaction_details?: { net_received_amount?: number };
      };
      const mpFee =
        (pAny.fee_details ?? []).reduce((s, f) => s + (Number(f.amount) || 0), 0) || undefined;
      const netAmount =
        typeof pAny.transaction_details?.net_received_amount === "number"
          ? pAny.transaction_details.net_received_amount
          : undefined;

      await updateOrder(orderId, {
        status,
        mpPaymentId: String(paymentId),
        ...(status === "approved" ? { mpFee, netAmount } : {}),
      });

      // Entrega digital idempotente: solo si aprobado y no entregado aún.
      if (status === "approved") {
        const order = await getOrder(orderId);
        debug.orderFound = Boolean(order);
        debug.alreadyFulfilled = Boolean(order?.fulfilledAt);
        if (order && !order.fulfilledAt) {
          await fulfillOrder(order);
          debug.outcome = "fulfilled";
        } else {
          debug.outcome = order ? "skipped_already_fulfilled" : "order_not_found";
        }
      } else {
        debug.outcome = "not_approved";
      }
    } else {
      debug.outcome = "no_external_reference";
    }
  } catch (err) {
    debug.outcome = "error";
    debug.error = (err as Error).message;
    console.error("[webhooks/mercadopago] Error procesando notificación:", err);
  }

  return NextResponse.json({ received: true, debug });
}
