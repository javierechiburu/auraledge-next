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

const securityHeaders = [
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
