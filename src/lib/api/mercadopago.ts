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
      auto_return: "approved",
      notification_url: `${SITE_URL}/api/webhooks/mercadopago`,
    },
  });

  return { init_point: result.init_point as string, preferenceId: result.id as string };
}

export async function getPayment(paymentId: string) {
  const payment = new Payment(client());
  return payment.get({ id: paymentId });
}
