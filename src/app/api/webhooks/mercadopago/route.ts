import { NextRequest, NextResponse } from "next/server";
import { getPayment } from "@/lib/api/mercadopago";
import { updateOrder } from "@/lib/api/strapi";
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
 */
export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const body = await request.json().catch(() => null);

  const type = searchParams.get("type") ?? body?.type;
  const paymentId = searchParams.get("data.id") ?? body?.data?.id;

  if (type !== "payment" || !paymentId) {
    return NextResponse.json({ received: true });
  }

  try {
    const payment = await getPayment(String(paymentId));
    const orderId = payment.external_reference;
    const status = STATUS_MAP[payment.status ?? "pending"] ?? "pending";

    if (orderId) {
      await updateOrder(orderId, { status, mpPaymentId: String(paymentId) });
    }
  } catch (err) {
    console.error("[webhooks/mercadopago] Error procesando notificación:", err);
  }

  return NextResponse.json({ received: true });
}
