import crypto from "crypto";

/**
 * Token de descarga firmado (HMAC-SHA256) y expirable, sin estado en el
 * servidor. Autoriza la descarga de UNA pista de UNA orden hasta `exp`.
 *
 * Formato: base64url(payloadJSON) + "." + base64url(hmac)
 * Payload: { orderId, slug, exp }  (exp = epoch en segundos)
 *
 * El secreto es `DOWNLOAD_TOKEN_SECRET`. Debe ser una cadena larga y aleatoria.
 */

interface DownloadPayload {
  orderId: string;
  slug: string;
  exp: number;
}

function secret(): string {
  const s = process.env.DOWNLOAD_TOKEN_SECRET;
  if (!s || s.length < 16) {
    throw new Error("DOWNLOAD_TOKEN_SECRET no configurado (mínimo 16 caracteres).");
  }
  return s;
}

function b64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(s: string): Buffer {
  return Buffer.from(s.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function sign(data: string): string {
  return b64url(crypto.createHmac("sha256", secret()).update(data).digest());
}

/** Genera un token de descarga válido por `ttlSeconds` (por defecto 7 días). */
export function createDownloadToken(
  orderId: string,
  slug: string,
  ttlSeconds = 60 * 60 * 24 * 7
): string {
  const payload: DownloadPayload = {
    orderId,
    slug,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encoded = b64url(Buffer.from(JSON.stringify(payload), "utf8"));
  return `${encoded}.${sign(encoded)}`;
}

/** Verifica un token. Devuelve el payload si es válido y no expiró; si no, null. */
export function verifyDownloadToken(token: string): DownloadPayload | null {
  const dot = token.indexOf(".");
  if (dot === -1) return null;
  const encoded = token.slice(0, dot);
  const sig = token.slice(dot + 1);

  const expected = sign(encoded);
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(sig, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(fromB64url(encoded).toString("utf8")) as DownloadPayload;
    if (!payload.orderId || !payload.slug || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
