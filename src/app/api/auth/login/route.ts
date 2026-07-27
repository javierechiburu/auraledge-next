import { NextResponse } from "next/server";
import { strapiLogin, StrapiAuthError } from "@/lib/api/strapi-auth";
import { setSessionCookie } from "@/lib/auth/session";
import { loginSchema, parsePayload } from "@/lib/validation";

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const parsed = parsePayload(loginSchema, raw);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { email, password } = parsed.data;

  try {
    const { jwt, user } = await strapiLogin(email, password);
    await setSessionCookie(jwt);
    return NextResponse.json({ user });
  } catch (err) {
    const status = err instanceof StrapiAuthError ? err.status : 502;
    const message =
      err instanceof StrapiAuthError ? err.message : "No se pudo iniciar sesión.";
    return NextResponse.json({ error: message }, { status });
  }
}
