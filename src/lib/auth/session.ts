import { cookies } from "next/headers";

/**
 * Gestión de la sesión: el JWT de Strapi se guarda en una cookie **httpOnly**
 * (no accesible desde JS del navegador → resistente a XSS). Todas las llamadas
 * autenticadas a Strapi pasan por rutas del servidor (BFF) que leen esta cookie.
 */
export const SESSION_COOKIE = "gm_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 días

export async function setSessionCookie(jwt: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getSessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}
