import { NextResponse } from "next/server";
import { strapiRegister, StrapiAuthError } from "@/lib/api/strapi-auth";
import { setSessionCookie } from "@/lib/auth/session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";

  if (!email || !EMAIL_RE.test(email) || password.length < 6) {
    return NextResponse.json(
      { error: "Correo inválido o contraseña menor a 6 caracteres." },
      { status: 400 }
    );
  }

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
