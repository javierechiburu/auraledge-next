import { NextResponse } from "next/server";
import { createOrder, updateOrder } from "@/lib/api/strapi";
import { createPreference, isMercadoPagoConfigured } from "@/lib/api/mercadopago";
import { CheckoutPayload, MPPreferenceResponse } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;

  if (!body?.items?.length || !body.customer?.name || !body.customer?.email) {
    return NextResponse.json({ error: "Payload de checkout inválido" }, { status: 400 });
  }

  if (!isMercadoPagoConfigured()) {
    return NextResponse.json(
      { error: "Mercado Pago no está configurado (falta MP_ACCESS_TOKEN)." },
      { status: 501 }
    );
  }

  const order = await createOrder(body.items, body.customer);

  try {
    const { init_point, preferenceId } = await createPreference(order.id, body.items);
    await updateOrder(order.id, { mpPreferenceId: preferenceId });

    const response: MPPreferenceResponse = { orderId: order.id, init_point };
    return NextResponse.json(response);
  } catch (err) {
    console.error("[checkout] Error creando la preferencia de Mercado Pago:", err);
    return NextResponse.json(
      { error: "No se pudo iniciar el pago con Mercado Pago." },
      { status: 502 }
    );
  }
}
