import { Order } from "../types";
import { updateOrder } from "./strapi";
import { createDownloadToken } from "./download-token";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Genio Music <onboarding@resend.dev>";

/** Construye el link de descarga firmado para una pista de una orden. */
export function downloadUrl(orderId: string, slug: string): string {
  const token = createDownloadToken(orderId, slug);
  return `${SITE_URL}/api/download/${encodeURIComponent(slug)}?token=${token}`;
}

/**
 * Entrega digital: envía el correo con los links de descarga firmados y marca la
 * orden como entregada (idempotencia via `fulfilledAt`). Idempotente: el llamador
 * (webhook) solo invoca esto si `order.fulfilledAt` está vacío y el pago aprobado.
 */
export async function fulfillOrder(order: Order): Promise<void> {
  if (order.fulfilledAt) return; // ya entregada
  const email = order.customer?.email;
  if (!email) {
    console.warn(`[fulfillment] Orden ${order.id} sin email; no se puede entregar.`);
    return;
  }

  const links = order.items.map((item) => ({
    name: item.name,
    url: downloadUrl(order.id, item.slug),
  }));

  const html = renderEmail(order.customer.name, links);

  if (!RESEND_API_KEY) {
    // No se loguean los links firmados (son credenciales de descarga). En dev se
    // muestran para poder probar; en producción solo se avisa que falta la key.
    if (process.env.NODE_ENV === "production") {
      console.warn(
        `[fulfillment] RESEND_API_KEY no configurado: no se envió el correo a ${email}.`
      );
    } else {
      console.warn(
        `[fulfillment] RESEND_API_KEY no configurado (dev). Links para ${email}:\n` +
          links.map((l) => `  - ${l.name}: ${l.url}`).join("\n")
      );
    }
  } else {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [email],
          subject: "Tu compra en Genio Music — descarga tus pistas",
          html,
        }),
      });
      if (!res.ok) {
        console.error("[fulfillment] Resend respondió", res.status, await res.text());
        return; // no marcar como entregada → se reintentará en la próxima notificación
      }
    } catch (err) {
      console.error("[fulfillment] Error enviando correo con Resend:", err);
      return;
    }
  }

  // Marca la orden como entregada para no reenviar.
  await updateOrder(order.id, { fulfilledAt: new Date().toISOString() });
}

function renderEmail(name: string, links: { name: string; url: string }[]): string {
  const items = links
    .map(
      (l) =>
        `<li style="margin:8px 0"><a href="${l.url}" style="color:#111;font-weight:600">${escapeHtml(
          l.name
        )}</a></li>`
    )
    .join("");
  return `
  <div style="font-family:system-ui,Arial,sans-serif;max-width:560px;margin:0 auto;color:#111">
    <h1 style="font-size:22px">¡Gracias por tu compra${name ? ", " + escapeHtml(name) : ""}!</h1>
    <p>Tus pistas están listas. Los siguientes enlaces son personales y expiran en 7 días:</p>
    <ul style="padding-left:18px">${items}</ul>
    <p style="color:#666;font-size:13px">Si el enlace expira, respóndenos y te generamos uno nuevo.</p>
    <p style="color:#999;font-size:12px">Genio Music</p>
  </div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
