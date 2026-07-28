/** @type {import('next').NextConfig} */
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const { hostname, protocol } = (() => {
  try {
    const u = new URL(strapiUrl);
    return { hostname: u.hostname, protocol: u.protocol.replace(":", "") };
  } catch {
    return { hostname: "localhost", protocol: "http" };
  }
})();

const isProd = process.env.NODE_ENV === "production";

// Content-Security-Policy. Se mantiene 'unsafe-inline' en scripts/estilos para no
// romper la hidratación de Next ni los estilos inline de GSAP/Tailwind, y
// 'unsafe-eval' solo en dev (React Refresh). Aun así endurece: object-src none,
// base-uri self, frame-ancestors none (anti-clickjacking) y orígenes de
// img/media/connect/font. Sube el nivel usando nonces si más adelante se requiere.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "media-src 'self' https:",
  "font-src 'self' data:",
  "connect-src 'self' https:",
  "frame-src https://*.mercadopago.com https://*.mercadolibre.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  // Solo en prod: en dev rompería las imágenes http de Strapi local.
  ...(isProd ? ["upgrade-insecure-requests"] : []),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// Hosts permitidos para next/image:
//  - El host derivado de NEXT_PUBLIC_STRAPI_URL (API; en local localhost:1337).
//  - Dominios de Strapi Cloud (la media se sirve desde *.strapiapp.com / su CDN).
//  - Un host extra opcional vía NEXT_PUBLIC_MEDIA_HOSTNAME (p. ej. bucket R2/CDN propio).
const remotePatterns = [
  { protocol, hostname, port: protocol === "http" ? "1337" : "", pathname: "/**" },
  { protocol: "https", hostname: "**.strapiapp.com", pathname: "/**" },
  { protocol: "https", hostname: "**.media.strapiapp.com", pathname: "/**" },
  // Cloudflare R2: la media se sirve con URLs firmadas desde el endpoint S3 del
  // bucket privado (https://<account-id>.r2.cloudflarestorage.com/...). El '*'
  // cubre cualquier account-id. Se omite `search` para permitir el query string
  // de la firma (X-Amz-*).
  { protocol: "https", hostname: "*.r2.cloudflarestorage.com", pathname: "/**" },
];

if (process.env.NEXT_PUBLIC_MEDIA_HOSTNAME) {
  remotePatterns.push({
    protocol: "https",
    hostname: process.env.NEXT_PUBLIC_MEDIA_HOSTNAME,
    pathname: "/**",
  });
}

const nextConfig = {
  images: {
    remotePatterns,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
