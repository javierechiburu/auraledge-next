import { CartItem, Customer, Menu, Order, Product } from "../types";
import { mockMenus, mockProducts } from "../mock-data";
import { DOWNLOAD_URL_TTL, MEDIA_URL_TTL, presignR2 } from "./r2";

/** Asegura que la URL base tenga esquema. Si la env viene sin `http(s)://`
 *  (error típico al pegarla en Netlify/Vercel), le antepone `https://` — así el
 *  `fetch` no lanza "Invalid URL" ni cae al mock por esa causa. */
function normalizeBaseUrl(raw?: string): string {
  if (!raw) return "http://localhost:1337";
  const trimmed = raw.trim().replace(/\/+$/, "");
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

const STRAPI_URL = normalizeBaseUrl(process.env.NEXT_PUBLIC_STRAPI_URL);
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
      // Timeout duro: si Strapi (p. ej. en Railway) tarda durante el build de
      // Next, se aborta y el llamador cae al mock — evita que la generación
      // estática se cuelgue >60s y falle el deploy (Netlify/Vercel).
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Strapi no disponible / timeout → el llamador usa datos mock.
    return null;
  }
}

interface StrapiList<T> {
  data: T[];
}

/** Extrae un array de relación (soporta v4 `{data:[...]}` y v5 array plano). */
function relArray(rel: unknown): Record<string, unknown>[] {
  if (!rel) return [];
  const arr = Array.isArray((rel as { data?: unknown }).data)
    ? (rel as { data: unknown[] }).data
    : Array.isArray(rel)
      ? (rel as unknown[])
      : [];
  return arr.map((x) => flatten(x));
}

/** Extrae una relación simple (soporta v4 `{data:{...}}` y v5 objeto plano). */
function relSingle(rel: unknown): Record<string, unknown> | null {
  if (!rel) return null;
  const obj = (rel as { data?: unknown }).data ?? rel;
  if (!obj || Array.isArray(obj)) return null;
  return flatten(obj);
}

async function mapProduct(raw: Record<string, unknown>): Promise<Product> {
  const p = flatten(raw);

  // El menú del producto se DERIVA de sus subcategorías (cada subcategoría
  // pertenece a un menú). No hay campo de menú manual: si el producto tiene una
  // subcategoría asociada al menú "beats", aparece en /c/beats automáticamente.
  const subs = relArray(p.subcategories);
  const menuSlugs = Array.from(
    new Set(subs.map((s) => relSingle(s.menu)?.slug as string).filter(Boolean))
  );

  // Bucket R2 privado: el preview (audio) se firma con URL temporal. Si Strapi
  // sirve desde disco local (dev) o no es R2, presignR2 devuelve la URL tal cual.
  const rawPreviewUrl = normalizeMedia(p.previewClip)?.url
    ? (mediaUrl(normalizeMedia(p.previewClip)!.url) as string)
    : null;
  const previewUrl = await presignR2(rawPreviewUrl, { expiresIn: MEDIA_URL_TTL });

  // Oferta automatizada: solo se ingresa `discountPercent` (0-100) en Strapi.
  // `price` es el precio FINAL (lo que se cobra). El "precio anterior" tachado
  // se DERIVA hacia arriba y se redondea a la decena para que se vea natural.
  const price = Number(p.price ?? 0);
  const discountPercent = p.discountPercent != null ? Number(p.discountPercent) : 0;
  const compareAtPrice =
    discountPercent > 0 && discountPercent < 100
      ? Math.round(price / (1 - discountPercent / 100) / 10) * 10
      : null;

  return {
    id: (p.id as number) ?? 0,
    documentId: p.documentId as string | undefined,
    slug: (p.slug as string) ?? "",
    name: (p.name as string) ?? "",
    subtitle: (p.subtitle as string) ?? "",
    description: (p.description as string) ?? "",
    price,
    discountPercent: discountPercent || null,
    compareAtPrice,
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
    previewUrl,
    bestValue: Boolean(p.bestValue),
    highlight: Boolean(p.highlight),
    menuSlugs,
    subcategorySlugs: subs.map((s) => s.slug as string).filter(Boolean),
    subcategoryNames: subs.map((s) => s.name as string).filter(Boolean),
  };
}

const PRODUCT_POPULATE =
  "populate[previewClip]=true&populate[subcategories][populate][menu]=true";

export async function getProducts(): Promise<Product[]> {
  const json = await strapiFetch<StrapiList<Record<string, unknown>>>(
    `/products?${PRODUCT_POPULATE}&pagination[pageSize]=100`
  );
  if (!json?.data?.length) return mockProducts;
  return Promise.all(json.data.map(mapProduct));
}

/** Productos de un menú (por slug del menú). Cae al mock filtrado si no hay Strapi. */
export async function getProductsByMenu(menuSlug: string): Promise<Product[]> {
  const json = await strapiFetch<StrapiList<Record<string, unknown>>>(
    `/products?${PRODUCT_POPULATE}&filters[subcategories][menu][slug][$eq]=${encodeURIComponent(
      menuSlug
    )}&pagination[pageSize]=100`
  );
  if (json?.data?.length) return Promise.all(json.data.map(mapProduct));
  return mockProducts.filter((p) => p.menuSlugs.includes(menuSlug));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const json = await strapiFetch<StrapiList<Record<string, unknown>>>(
    `/products?filters[slug][$eq]=${encodeURIComponent(slug)}&${PRODUCT_POPULATE}`
  );
  if (json?.data?.length) return mapProduct(json.data[0]);
  return mockProducts.find((p) => p.slug === slug) ?? null;
}

/** Menús del navbar, ordenados, con sus subcategorías. Cae al mock si no hay Strapi. */
export async function getMenus(): Promise<Menu[]> {
  const json = await strapiFetch<StrapiList<Record<string, unknown>>>(
    "/menus?populate[subcategories]=true&sort=order:asc&pagination[pageSize]=50"
  );
  if (!json?.data?.length) return mockMenus;
  return json.data.map((raw) => {
    const m = flatten(raw);
    return {
      id: (m.id as number) ?? 0,
      name: (m.name as string) ?? "",
      slug: (m.slug as string) ?? "",
      order: Number(m.order ?? 0),
      icon: (m.icon as string) ?? null,
      subcategories: relArray(m.subcategories).map((s) => ({
        id: (s.id as number) ?? 0,
        name: (s.name as string) ?? "",
        slug: (s.slug as string) ?? "",
        menuSlug: (m.slug as string) ?? null,
      })),
    };
  });
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
