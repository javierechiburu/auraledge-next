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
  name?: string;
  mime?: string;
}
type StrapiMedia = (MediaAttrs & { data?: { attributes?: MediaAttrs } }) | null | undefined;

/** Extrae los atributos crudos de un campo media (soporta v4 anidado y v5 plano). */
function normalizeMedia(media: unknown): MediaAttrs | null {
  const m = media as StrapiMedia;
  if (!m) return null;
  const attrs: MediaAttrs = m.data?.attributes ?? m;
  return attrs.url ? attrs : null;
}

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
    category: (p.category as string) ?? null,
    features: Array.isArray(p.features)
      ? (p.features as string[])
      : typeof p.features === "string"
        ? (p.features as string).split(",").map((f) => f.trim())
        : [],
    genre: (p.genre as string) ?? null,
    bpm: p.bpm != null ? Number(p.bpm) : null,
    musicalKey: (p.musicalKey as string) ?? null,
    durationSeconds: p.durationSeconds != null ? Number(p.durationSeconds) : null,
    previewSeconds: p.previewSeconds != null ? Number(p.previewSeconds) : null,
    previewUrl: normalizeMedia(p.previewClip)?.url
      ? (mediaUrl(normalizeMedia(p.previewClip)!.url) as string)
      : null,
    bestValue: Boolean(p.bestValue),
    highlight: Boolean(p.highlight),
    image: normalizeImage(p.image as StrapiMedia),
  };
}

export async function getProducts(): Promise<Product[]> {
  const json = await strapiFetch<StrapiList<Record<string, unknown>>>(
    "/products?populate[image]=true&populate[previewClip]=true&pagination[pageSize]=100"
  );
  if (!json?.data?.length) return mockProducts;
  return json.data.map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const json = await strapiFetch<StrapiList<Record<string, unknown>>>(
    `/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[image]=true&populate[previewClip]=true`
  );
  if (json?.data?.length) return mapProduct(json.data[0]);
  return mockProducts.find((p) => p.slug === slug) ?? null;
}

/**
 * SEGURIDAD: reconstruye el carrito usando SIEMPRE los datos autoritativos del
 * servidor (precio, nombre, imagen) a partir del `slug`. Nunca confía en el
 * `price` que envía el navegador. Descarta ítems inexistentes y normaliza `qty`.
 * Devuelve los ítems verificados que deben usarse para crear la orden y la
 * preferencia de pago.
 */
export async function buildVerifiedCart(
  clientItems: Array<{ slug?: unknown; qty?: unknown }>
): Promise<CartItem[]> {
  const verified: CartItem[] = [];
  const seen = new Set<string>();

  for (const ci of clientItems) {
    const slug = typeof ci?.slug === "string" ? ci.slug.trim() : "";
    if (!slug || seen.has(slug)) continue;

    // Producto digital: una licencia por pista. Se fija qty a 1.
    const qty = 1;

    const product = await getProductBySlug(slug);
    if (!product || !Number.isFinite(product.price) || product.price <= 0) continue;

    seen.add(slug);
    verified.push({
      slug: product.slug,
      name: product.name,
      price: product.price, // precio autoritativo del servidor
      image: product.image?.url ?? null,
      qty,
    });
  }

  return verified;
}

/**
 * Crea una orden en Strapi (content-type "Order", ver STRAPI.md).
 * Si Strapi no responde (o el content-type todavía no existe), no bloquea el
 * checkout: genera un id local y deja seguir el flujo de pago igualmente.
 */
export async function createOrder(
  items: CartItem[],
  customer: Customer,
  userId?: number | null
): Promise<Order> {
  const total = items.reduce((n, i) => n + i.qty * i.price, 0);

  try {
    const res = await fetch(`${STRAPI_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
      body: JSON.stringify({
        data: { items, customer, total, status: "pending", ...(userId ? { user: userId } : {}) },
      }),
      cache: "no-store",
    });
    if (res.ok) {
      const json = (await res.json()) as { data: Record<string, unknown> };
      const created = flatten(json.data);
      return {
        // Strapi 5 identifica los recursos REST por documentId (no el id numérico).
        id: String(created.documentId ?? created.id ?? crypto.randomUUID()),
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

/** Lee una orden desde Strapi. Devuelve null para órdenes locales o si no existe. */
export async function getOrder(orderId: string): Promise<Order | null> {
  if (!orderId || orderId.startsWith("local-")) return null;
  try {
    const res = await fetch(`${STRAPI_URL}/api/orders/${orderId}`, {
      headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: Record<string, unknown> };
    if (!json.data) return null;
    const o = flatten(json.data);
    const parse = <T>(v: unknown): T =>
      typeof v === "string" ? (JSON.parse(v) as T) : (v as T);
    return {
      id: String(o.id ?? o.documentId ?? orderId),
      items: parse<CartItem[]>(o.items) ?? [],
      customer: parse<Customer>(o.customer) ?? { name: "", email: "" },
      total: Number(o.total ?? 0),
      status: (o.status as Order["status"]) ?? "pending",
      mpPreferenceId: (o.mpPreferenceId as string) ?? null,
      mpPaymentId: (o.mpPaymentId as string) ?? null,
      fulfilledAt: (o.fulfilledAt as string) ?? null,
    };
  } catch {
    return null;
  }
}

/** Metadatos del archivo full (privado) de una pista, obtenidos con el API token. */
export interface FullTrackFile {
  url: string; // URL absoluta hacia el storage de Strapi (o del provider)
  name: string;
  mime: string;
}

/**
 * Obtiene el archivo COMPLETO (privado) de una pista por slug, usando el API
 * token del servidor. El campo `fullTrack` es privado en Strapi, por lo que solo
 * es accesible con credenciales de servidor — nunca se expone al navegador.
 */
export async function getTrackFullFile(slug: string): Promise<FullTrackFile | null> {
  const json = await strapiFetch<StrapiList<Record<string, unknown>>>(
    `/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=fullTrack`
  );
  const raw = json?.data?.[0];
  if (!raw) return null;
  const p = flatten(raw);
  const media = normalizeMedia(p.fullTrack);
  if (!media?.url) return null;
  return {
    url: mediaUrl(media.url) as string,
    name: media.name ?? `${slug}.mp3`,
    mime: media.mime ?? "application/octet-stream",
  };
}

/** Actualiza el estado de una orden en Strapi (usado por el webhook de Mercado Pago). */
export async function updateOrder(
  orderId: string,
  patch: Partial<
    Pick<Order, "status" | "mpPreferenceId" | "mpPaymentId" | "fulfilledAt" | "netAmount" | "mpFee">
  >
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
