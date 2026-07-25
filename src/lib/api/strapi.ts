import { CartItem, Customer, Order, Product, StrapiImage } from "../types";
import { mockProducts } from "../mock-data";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

/** Convierte una URL relativa de un asset de Strapi en absoluta. */
export function mediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

interface MediaAttrs {
  url?: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
}
type StrapiMedia = (MediaAttrs & { data?: { attributes?: MediaAttrs } }) | null | undefined;

/** Normaliza un campo media que puede venir en formato Strapi v4 o v5. */
function normalizeImage(media: StrapiMedia): StrapiImage | null {
  if (!media) return null;
  const attrs: MediaAttrs = media.data?.attributes ?? media;
  if (!attrs.url) return null;
  return {
    url: mediaUrl(attrs.url) as string,
    alternativeText: attrs.alternativeText ?? null,
    width: attrs.width,
    height: attrs.height,
  };
}

/** Aplana una entidad de Strapi (soporta v4 `{id, attributes}` y v5 plano). */
function flatten(entity: unknown): Record<string, unknown> {
  const e = entity as { id?: number; attributes?: Record<string, unknown> };
  if (e && typeof e === "object" && e.attributes) {
    return { id: e.id, ...e.attributes };
  }
  return entity as Record<string, unknown>;
}

async function strapiFetch<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
      // ISR: revalida cada 60s. Cambia a { cache: "no-store" } si quieres siempre fresco.
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Strapi no disponible → el llamador usa datos mock.
    return null;
  }
}

interface StrapiList<T> {
  data: T[];
}

function mapProduct(raw: Record<string, unknown>): Product {
  const p = flatten(raw);
  return {
    id: (p.id as number) ?? 0,
    documentId: p.documentId as string | undefined,
    slug: (p.slug as string) ?? "",
    name: (p.name as string) ?? "",
    subtitle: (p.subtitle as string) ?? "",
    description: (p.description as string) ?? "",
    price: Number(p.price ?? 0),
    compareAtPrice: p.compareAtPrice != null ? Number(p.compareAtPrice) : null,
    tag: (p.tag as string) ?? null,
    badge: (p.badge as string) ?? null,
    features: Array.isArray(p.features)
      ? (p.features as string[])
      : typeof p.features === "string"
        ? (p.features as string).split(",").map((f) => f.trim())
        : [],
    batteryHours: p.batteryHours != null ? Number(p.batteryHours) : null,
    noiseCancelling: p.noiseCancelling != null ? Number(p.noiseCancelling) : null,
    bestValue: Boolean(p.bestValue),
    highlight: Boolean(p.highlight),
    image: normalizeImage(p.image as StrapiMedia),
  };
}

export async function getProducts(): Promise<Product[]> {
  const json = await strapiFetch<StrapiList<Record<string, unknown>>>(
    "/products?populate=image&pagination[pageSize]=100"
  );
  if (!json?.data?.length) return mockProducts;
  return json.data.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const json = await strapiFetch<StrapiList<Record<string, unknown>>>(
    `/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=image`
  );
  if (json?.data?.length) return mapProduct(json.data[0]);
  return mockProducts.find((p) => p.slug === slug) ?? null;
}

/**
 * Crea una orden en Strapi (content-type "Order", ver STRAPI.md).
 * Si Strapi no responde (o el content-type todavía no existe), no bloquea el
 * checkout: genera un id local y deja seguir el flujo de pago igualmente.
 */
export async function createOrder(items: CartItem[], customer: Customer): Promise<Order> {
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);

  try {
    const res = await fetch(`${STRAPI_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify({ data: { items, customer, total, status: "pending" } }),
      cache: "no-store",
    });
    if (res.ok) {
      const json = (await res.json()) as { data: Record<string, unknown> };
      const created = flatten(json.data);
      return {
        id: String(created.id ?? created.documentId ?? crypto.randomUUID()),
        items,
        customer,
        total,
        status: "pending",
      };
    }
  } catch {
    // Strapi no disponible → seguimos con un id local, ver docstring.
  }

  console.warn("[strapi] No se pudo crear la orden en Strapi, usando id local.");
  return { id: `local-${crypto.randomUUID()}`, items, customer, total, status: "pending" };
}

/** Actualiza el estado de una orden en Strapi (usado por el webhook de Mercado Pago). */
export async function updateOrder(
  orderId: string,
  patch: Partial<Pick<Order, "status" | "mpPreferenceId" | "mpPaymentId">>
): Promise<void> {
  if (orderId.startsWith("local-")) {
    console.warn(`[strapi] Orden local ${orderId}, no hay nada que actualizar en Strapi.`);
    return;
  }
  try {
    await fetch(`${STRAPI_URL}/api/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify({ data: patch }),
      cache: "no-store",
    });
  } catch {
    console.warn(`[strapi] No se pudo actualizar la orden ${orderId} en Strapi.`);
  }
}
