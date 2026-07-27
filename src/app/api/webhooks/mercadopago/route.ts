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

  if (signatureState === "invalid") {
    console.warn("[webhooks/mercadopago] Firma inválida — notificación rechazada.");
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
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
    return NextResponse.json({ received: true });
  }

  try {
    const payment = await getPayment(String(paymentId));
    const orderId = payment.external_reference;
    const status = STATUS_MAP[payment.status ?? "pending"] ?? "pending";

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
        if (order && !order.fulfilledAt) {
          await fulfillOrder(order);
        }
      }
    }
  } catch (err) {
    console.error("[webhooks/mercadopago] Error procesando notificación:", err);
  }

  return NextResponse.json({ received: true });
}
