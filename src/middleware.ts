import { NextRequest, NextResponse } from "next/server";

/**
 * Rate limiting básico (ventana deslizante en memoria) para las rutas sensibles:
 * login, registro y checkout. Mitiga fuerza bruta y spam.
 *
 * NOTA: en memoria = por instancia. En Vercel (serverless/edge distribuido) esto
 * es una barrera baseline; para protección fuerte en producción usar un store
 * distribuido (p. ej. Upstash Redis / @upstash/ratelimit).
 */
const WINDOW_MS = 60_000; // 1 minuto

const LIMITS: { pattern: RegExp; max: number }[] = [
  { pattern: /^\/api\/auth\/(login|register)$/, max: 8 }, // 8 intentos/min
  { pattern: /^\/api\/checkout$/, max: 15 },
];

const hits = new Map<string, { count: number; reset: number }>();

function limitFor(path: string) {
  return LIMITS.find((l) => l.pattern.test(path));
}

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const limit = limitFor(path);
  if (!limit) return NextResponse.next();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const key = `${path}:${ip}`;
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || entry.reset < now) {
    // Poda ocasional de entradas expiradas para no crecer sin límite.
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    }
    hits.set(key, { count: 1, reset: now + WINDOW_MS });
    return NextResponse.next();
  }

  entry.count += 1;
  if (entry.count > limit.max) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Espera un momento e intenta de nuevo." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/auth/:path*", "/api/checkout"],
};
