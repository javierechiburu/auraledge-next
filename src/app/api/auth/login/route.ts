import { NextResponse } from "next/server";
import { strapiLogin, StrapiAuthError } from "@/lib/api/strapi-auth";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";

  if (!email || !password) {
    return NextResponse.json({ error: "Ingresa correo y contraseña." }, { status: 400 });
  }

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
