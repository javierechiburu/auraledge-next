import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Firma de URLs de Cloudflare R2 (bucket PRIVADO). Todo el media vive en un
 * bucket privado; nada es accesible por URL directa. Este módulo genera URLs
 * presignadas y de corta/media duración para servir:
 *   - imagen y preview (marketing, público) → expiración larga
 *   - fullTrack (producto pagado)           → expiración corta, solo tras compra
 *
 * SOLO servidor: usa credenciales secretas de R2. Nunca importar en componentes
 * cliente. Si R2 no está configurado (o la URL no apunta al bucket, p. ej. disco
 * local en desarrollo), las funciones devuelven la URL original sin tocar.
 */

const ENDPOINT = process.env.R2_ENDPOINT;
const BUCKET = process.env.R2_BUCKET;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

const isConfigured = Boolean(ENDPOINT && BUCKET && ACCESS_KEY_ID && SECRET_ACCESS_KEY);

/** Expiración de URLs de media pública (imagen/preview). R2 permite hasta 7 días. */
export const MEDIA_URL_TTL = 60 * 60 * 24 * 6; // 6 días
/** Expiración de la URL del fullTrack (descarga tras compra). Corta a propósito. */
export const DOWNLOAD_URL_TTL = 60 * 5; // 5 minutos

let client: S3Client | null = null;
function getClient(): S3Client {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: ENDPOINT,
      credentials: { accessKeyId: ACCESS_KEY_ID as string, secretAccessKey: SECRET_ACCESS_KEY as string },
      forcePathStyle: true,
    });
  }
  return client;
}

/** Host del endpoint R2, para reconocer qué URLs apuntan al bucket. */
const endpointHost = (() => {
  try {
    return ENDPOINT ? new URL(ENDPOINT).host : null;
  } catch {
    return null;
  }
})();

/**
 * Extrae la object key desde una URL de media almacenada por Strapi (path-style:
 * https://<endpoint>/<bucket>/<key>). Devuelve null si la URL no es del bucket R2
 * (p. ej. una URL relativa o de localhost en desarrollo con disco local).
 */
function extractKey(rawUrl: string): string | null {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    return null; // URL relativa → no es R2
  }
  if (endpointHost && u.host !== endpointHost) return null;
  let path = decodeURIComponent(u.pathname).replace(/^\/+/, "");
  if (BUCKET && path.startsWith(`${BUCKET}/`)) path = path.slice(BUCKET.length + 1);
  return path || null;
}

/**
 * Firma una URL de R2 para lectura temporal. Si R2 no está configurado o la URL
 * no apunta al bucket, devuelve la URL original (soporta desarrollo local con
 * disco de Strapi sin R2).
 *
 * @param downloadName Si se indica, fuerza la descarga con ese nombre de archivo
 *                     (Content-Disposition: attachment) — úsalo para el fullTrack.
 */
export async function presignR2(
  rawUrl: string | null | undefined,
  opts: { expiresIn?: number; downloadName?: string } = {}
): Promise<string | null> {
  if (!rawUrl) return null;
  if (!isConfigured) return rawUrl;

  const key = extractKey(rawUrl);
  if (!key) return rawUrl;

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key,
    ...(opts.downloadName
      ? {
          ResponseContentDisposition: `attachment; filename="${opts.downloadName.replace(/"/g, "")}"`,
        }
      : {}),
  });

  return getSignedUrl(getClient(), command, { expiresIn: opts.expiresIn ?? MEDIA_URL_TTL });
}
