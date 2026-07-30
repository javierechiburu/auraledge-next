import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { CartItem } from "../types";

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function isMercadoPagoConfigured(): boolean {
  return Boolean(ACCESS_TOKEN);
}

function client(): MercadoPagoConfig {
  if (!ACCESS_TOKEN) {
    throw new Error("MP_ACCESS_TOKEN no está configurado.");
  }
  return new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });
}

export async function createPreference(orderId: string, items: CartItem[]) {
  const preference = new Preference(client());

  // Mercado Pago rechaza `auto_return` (y a veces `notification_url`) cuando la
  // URL no es pública. En local (localhost) se omiten para poder probar el flujo;
  // en producción, con NEXT_PUBLIC_SITE_URL = https://tudominio, se incluyen.
  const isPublicSite =
    /^https:\/\//i.test(SITE_URL) && !/localhost|127\.0\.0\.1/i.test(SITE_URL);

  const result = await preference.create({
    body: {
      items: items.map((item) => ({
        id: item.slug,
        title: item.name,
        quantity: item.qty,
        unit_price: item.price,
        currency_id: "CLP",
        picture_url: item.image ?? undefined,
      })),
      external_reference: orderId,
      back_urls: {
        success: `${SITE_URL}/checkout?status=success`,
        pending: `${SITE_URL}/checkout?status=pending`,
        failure: `${SITE_URL}/checkout?status=failure`,
      },
      // Solo con URL pública: MP rechaza auto_return con localhost.
      ...(isPublicSite ? { auto_return: "approved" as const } : {}),
      ...(isPublicSite
        ? { notification_url: `${SITE_URL}/api/webhooks/mercadopago` }
        : {}),
    },
  });

  // Con MP_SANDBOX=true se usa sandbox_init_point (entorno de pruebas explícito).
  // Por defecto se usa init_point (que, con credenciales de prueba, ya es test).
  const useSandbox = process.env.MP_SANDBOX === "true";
  const initPoint =
    useSandbox && result.sandbox_init_point
      ? result.sandbox_init_point
      : result.init_point;

  return { init_point: initPoint as string, preferenceId: result.id as string };
}

export async function getPayment(paymentId: string) {
  const payment = new Payment(client());
  return payment.get({ id: paymentId });
}
