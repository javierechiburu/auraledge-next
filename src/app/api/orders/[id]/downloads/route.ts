import { NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/api/strapi";
import { getPayment } from "@/lib/api/mercadopago";
import { downloadUrl, fulfillOrder } from "@/lib/api/fulfillment";

/**
 * Links de descarga de una orden, para la pantalla de agradecimiento tras el pago.
 *
 * Aprobación desde el retorno (respaldo del webhook): si la orden no está
 * `approved` pero llega el `payment_id` de la URL de retorno de MP, se VERIFICA
 * el pago contra la API de MP (no se confía en la URL) y, si está `approved` y
 * corresponde a esta orden, se aprueba y se entrega.
 *
 * NOTA: incluye un objeto `debug` en la respuesta cuando la orden NO queda
 * aprobada, para diagnosticar en el Network tab del navegador. QUITAR después.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let order = await getOrder(id);
  if (!order) {
    return NextResponse.json({ status: "not_found", debug: { orderId: id } }, { status: 404 });
  }

  let debug: Record<string, unknown> | undefined;

  if (order.status !== "approved") {
    const paymentId = new URL(request.url).searchParams.get("payment_id");
    if (!paymentId) {
      debug = { reason: "no_payment_id_in_url", orderStatus: order.status };
    } else {
      try {
        const payment = await getPayment(paymentId);
        const extRef = (payment as { external_reference?: string }).external_reference;
        debug = {
          paymentId,
          paymentStatus: payment.status,
          paymentExternalRef: extRef ?? null,
          orderId: id,
          extRefMatches: extRef === id,
        };
        if (payment.status === "approved" && extRef === id) {
          await updateOrder(id, { status: "approved", mpPaymentId: String(paymentId) });
          const fresh = await getOrder(id);
          if (fresh && !fresh.fulfilledAt) await fulfillOrder(fresh);
          order = { ...order, status: "approved" };
        }
      } catch (err) {
        debug = { paymentId, error: (err as Error).message };
      }
    }
  }

  if (order.status !== "approved") {
    return NextResponse.json({ status: order.status, debug });
  }

  const downloads = order.items.map((it) => ({
    slug: it.slug,
    name: it.name,
    url: downloadUrl(id, it.slug),
  }));

  return NextResponse.json({ status: "approved", downloads });
}
