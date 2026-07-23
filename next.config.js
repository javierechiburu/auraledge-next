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

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol, hostname, port: protocol === "http" ? "1337" : "", pathname: "/**" },
    ],
  },
};

module.exports = nextConfig;
