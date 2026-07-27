import { NextRequest, NextResponse } from "next/server";
import { strapiProviderCallback } from "@/lib/api/strapi-auth";
import { setSessionCookie } from "@/lib/auth/session";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Callback de Google OAuth. Strapi, tras autenticar con Google, redirige aquí
 * con `?access_token=...`. Intercambiamos ese token por un JWT de Strapi, lo
 * guardamos en la cookie httpOnly y mandamos al usuario a su perfil.
 *
 * Configura en Strapi (Settings → Providers → Google) el redirect a:
 *   {SITE_URL}/api/auth/google/callback
 */
export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();
  const accessToken = request.nextUrl.searchParams.get("access_token");

  if (!accessToken) {
    return NextResponse.redirect(`${SITE_URL}/login?error=google`);
  }

  try {
    const { jwt } = await strapiProviderCallback("google", query);
    await setSessionCookie(jwt);
    return NextResponse.redirect(`${SITE_URL}/perfil`);
  } catch {
    return NextResponse.redirect(`${SITE_URL}/login?error=google`);
  }
}
