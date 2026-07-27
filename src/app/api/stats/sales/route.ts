import { NextResponse } from "next/server";
import { strapiMe } from "@/lib/api/strapi-auth";
import { getSessionToken } from "@/lib/auth/session";
import { isAdminEmail } from "@/lib/auth/admin";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

/**
 * Estadísticas de ventas para el panel de administración.
 * Doble protección: (1) requiere sesión de un usuario admin (ADMIN_EMAILS);
 * (2) consulta la API `stats` de Strapi con el API token del servidor.
 */
export async function GET() {
  const jwt = await getSessionToken();
  const user = jwt ? await strapiMe(jwt) : null;

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 403 });
  }

  if (!TOKEN) {
    return NextResponse.json(
      { error: "Falta STRAPI_API_TOKEN para leer las estadísticas." },
      { status: 501 }
    );
  }

  const res = await fetch(`${STRAPI_URL}/api/stats/sales`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return NextResponse.json({ error: "No se pudieron obtener las estadísticas." }, { status: 502 });
  }

  const stats = await res.json();
  return NextResponse.json(stats);
}
