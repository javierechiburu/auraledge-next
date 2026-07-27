import crypto from "crypto";

/**
 * Verifica la firma HMAC de un webhook de Mercado Pago.
 *
 * Mercado Pago envía la cabecera `x-signature` con el formato:
 *   `ts=<timestamp>,v1=<hmacSha256Hex>`
 * y `x-request-id`. El manifiesto firmado es:
 *   `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`
 * donde `<data.id>` es el query param `data.id` de la notificación (en
 * minúsculas si es alfanumérico). El HMAC-SHA256 usa el secreto configurado en
 * el panel de Mercado Pago (Webhooks) — variable de entorno `MP_WEBHOOK_SECRET`.
 *
 * Docs: https://www.mercadopago.com/developers/es/docs/your-integrations/notifications/webhooks
 *
 * @returns "valid" | "invalid" | "unconfigured"
 */
export function verifyMercadoPagoSignature(params: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string | null;
  secret: string | undefined;
}): "valid" | "invalid" | "unconfigured" {
  const { xSignature, xRequestId, dataId, secret } = params;

  if (!secret) return "unconfigured";
  if (!xSignature) return "invalid";

  // Parsear "ts=...,v1=..."
  const parts = Object.fromEntries(
    xSignature.split(",").map((kv) => {
      const idx = kv.indexOf("=");
      return idx === -1 ? [kv.trim(), ""] : [kv.slice(0, idx).trim(), kv.slice(idx + 1).trim()];
    })
  ) as Record<string, string>;

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return "invalid";

  // Mercado Pago usa el id en minúsculas cuando es alfanumérico.
  const normalizedId = dataId ? dataId.toLowerCase() : "";

  const manifest = `id:${normalizedId};request-id:${xRequestId ?? ""};ts:${ts};`;
  const expected = crypto.createHmac("sha256", secret).update(manifest).digest("hex");

  // Comparación en tiempo constante.
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(v1, "utf8");
  if (a.length !== b.length) return "invalid";
  return crypto.timingSafeEqual(a, b) ? "valid" : "invalid";
}
