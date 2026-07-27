import { NextResponse } from "next/server";
import { strapiMe } from "@/lib/api/strapi-auth";
import { clearSessionCookie, getSessionToken } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/admin";

/** Devuelve el usuario de la sesión actual (o null). Limpia la cookie si expiró. */
export async function GET() {
  const jwt = await getSessionToken();
  if (!jwt) return NextResponse.json({ user: null });

  const user = await strapiMe(jwt);
  if (!user) {
    await clearSessionCookie();
    return NextResponse.json({ user: null });
  }
  return NextResponse.json({ user: { ...user, isAdmin: isAdminEmail(user.email) } });
}
