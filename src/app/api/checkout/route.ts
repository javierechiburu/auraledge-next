import { NextResponse } from "next/server";
import { buildVerifiedCart, createOrder, updateOrder } from "@/lib/api/strapi";
import { createPreference, isMercadoPagoConfigured } from "@/lib/api/mercadopago";
import { strapiMe } from "@/lib/api/strapi-auth";
import { getSessionToken } from "@/lib/auth/session";
import { CheckoutPayload, MPPreferenceResponse } from "@/lib/types";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as CheckoutPayload | null;

  const name = body?.customer?.name?.trim();
  const email = body?.customer?.email?.trim().toLowerCase();

  if (!body?.items?.length || !name || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Payload de checkout inválido" }, { status: 400 });
  }

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

  const customer = { name, email, phone: body.customer.phone?.trim() || undefined };

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
