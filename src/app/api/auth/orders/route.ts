import { NextResponse } from "next/server";
import { getSessionToken } from "@/lib/auth/session";
import { downloadUrl } from "@/lib/api/fulfillment";
import { CartItem, UserOrder } from "@/lib/types";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

/**
 * Órdenes del usuario autenticado. Consulta Strapi con el JWT de la sesión: el
 * controller de Strapi ya filtra por el propio usuario, así que solo llegan sus
 * órdenes. Para las órdenes `approved` adjunta links de descarga firmados.
 */
export async function GET() {
  const jwt = await getSessionToken();
  if (!jwt) return NextResponse.json({ error: "No autenticado." }, { status: 401 });

  const res = await fetch(
    `${STRAPI_URL}/api/orders?sort=createdAt:desc&pagination[pageSize]=100`,
    { headers: { Authorization: `Bearer ${jwt}` }, cache: "no-store" }
  );
  if (!res.ok) {
    return NextResponse.json({ error: "No se pudieron obtener las compras." }, { status: 502 });
  }

  const json = (await res.json()) as { data?: Array<Record<string, unknown>> };
  const parse = <T>(v: unknown): T =>
    typeof v === "string" ? (JSON.parse(v) as T) : (v as T);

  const orders: UserOrder[] = (json.data ?? []).map((raw) => {
    const id = String(raw.documentId ?? raw.id ?? "");
    const items = parse<CartItem[]>(raw.items) ?? [];
    const status = (raw.status as UserOrder["status"]) ?? "pending";
    const order: UserOrder = {
      id,
      documentId: raw.documentId as string | undefined,
      items,
      total: Number(raw.total ?? 0),
      status,
      createdAt: raw.createdAt as string | undefined,
    };
    if (status === "approved") {
      order.downloads = items.map((it) => ({
        slug: it.slug,
        name: it.name,
        url: downloadUrl(id, it.slug),
      }));
    }
    return order;
  });

  return NextResponse.json({ orders });
}
