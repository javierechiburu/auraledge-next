import { NextResponse } from "next/server";
import { buildVerifiedCart, createOrder, updateOrder } from "@/lib/api/strapi";
import { createPreference, isMercadoPagoConfigured } from "@/lib/api/mercadopago";
import { strapiMe } from "@/lib/api/strapi-auth";
import { getSessionToken } from "@/lib/auth/session";
import { checkoutSchema, parsePayload } from "@/lib/validation";
import { MPPreferenceResponse } from "@/lib/types";

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const parsed = parsePayload(checkoutSchema, raw);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const body = parsed.data;

  if (!isMercadoPagoConfigured()) {
    return NextResponse.json(
      { error: "Mercado Pago no está configurado (falta MP_ACCESS_TOKEN)." },
      { status: 501 }
    );
  }

  // SEGURIDAD: se ignoran los precios del cliente y se reconstruye el carrito
  // con los datos autoritativos del servidor a partir del slug.
  const items = await buildVerifiedCart(body.items);
  if (!items.length) {
    return NextResponse.json(
      { error: "Ninguno de los productos del carrito es válido." },
      { status: 400 }
    );
  }

  const customer = {
    name: body.customer.name,
    email: body.customer.email,
    phone: body.customer.phone || undefined,
  };

  // Si hay sesión, se liga la orden al usuario para que aparezca en su perfil.
  const jwt = await getSessionToken();
  const user = jwt ? await strapiMe(jwt) : null;

  const order = await createOrder(items, customer, user?.id ?? null);

  try {
    const { init_point, preferenceId } = await createPreference(order.id, items);
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
