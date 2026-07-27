import { AuthUser } from "../types";

/**
 * Cliente de autenticación contra el plugin Users & Permissions de Strapi.
 * Se usa SOLO desde rutas del servidor (BFF). Nunca expone el JWT al navegador.
 */
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export interface AuthResult {
  jwt: string;
  user: AuthUser;
}

/** El registro puede volver SIN jwt cuando la confirmación de email está activa. */
export interface RegisterResult {
  jwt?: string;
  user?: AuthUser;
}

export class StrapiAuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function parseError(res: Response): Promise<never> {
  const json = (await res.json().catch(() => null)) as
    | { error?: { message?: string } }
    | null;
  const message = json?.error?.message || `Error ${res.status}`;
  // Traducciones amables de los mensajes más comunes de Strapi.
  const friendly =
    /invalid identifier or password/i.test(message)
      ? "Correo o contraseña incorrectos."
      : /email.*taken|already taken/i.test(message)
        ? "Ese correo ya está registrado."
        : /password.*(short|length)/i.test(message)
          ? "La contraseña es demasiado corta (mínimo 6 caracteres)."
          : message;
  throw new StrapiAuthError(friendly, res.status);
}

export async function strapiRegister(email: string, password: string): Promise<RegisterResult> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: email, email, password }),
    cache: "no-store",
  });
  if (!res.ok) return parseError(res);
  // Con confirmación activa, Strapi responde 200 con { user } y SIN jwt.
  return (await res.json()) as RegisterResult;
}

export async function strapiLogin(email: string, password: string): Promise<AuthResult> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email, password }),
    cache: "no-store",
  });
  if (!res.ok) return parseError(res);
  return (await res.json()) as AuthResult;
}

/** Devuelve el usuario del JWT, o null si el token es inválido/expiró. */
export async function strapiMe(jwt: string): Promise<AuthUser | null> {
  const res = await fetch(`${STRAPI_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const u = (await res.json()) as AuthUser;
  return u?.id ? { id: u.id, username: u.username, email: u.email } : null;
}

/** Intercambia el access_token de un proveedor OAuth (Google) por un JWT de Strapi. */
export async function strapiProviderCallback(
  provider: string,
  query: string
): Promise<AuthResult> {
  const res = await fetch(`${STRAPI_URL}/api/auth/${provider}/callback?${query}`, {
    cache: "no-store",
  });
  if (!res.ok) return parseError(res);
  return (await res.json()) as AuthResult;
}
