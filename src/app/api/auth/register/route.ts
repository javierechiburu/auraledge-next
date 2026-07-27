import { NextResponse } from "next/server";
import { strapiRegister, StrapiAuthError } from "@/lib/api/strapi-auth";
import { setSessionCookie } from "@/lib/auth/session";
import { registerSchema, parsePayload } from "@/lib/validation";

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  const parsed = parsePayload(registerSchema, raw);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }
  const { email, password } = parsed.data;

  try {
    const { jwt, user } = await strapiRegister(email, password);

    // Confirmación de email activa: Strapi no devuelve jwt. No iniciamos sesión;
    // el usuario debe confirmar desde el correo.
    if (!jwt) {
      return NextResponse.json({ needsConfirmation: true });
    }

    await setSessionCookie(jwt);
    return NextResponse.json({ user });
  } catch (err) {
    const status = err instanceof StrapiAuthError ? err.status : 502;
    const message = err instanceof StrapiAuthError ? err.message : "No se pudo registrar.";
    return NextResponse.json({ error: message }, { status });
  }
}
