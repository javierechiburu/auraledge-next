import { Product, Testimonial, StrapiImage } from "./types";
import { mockProducts, mockTestimonials } from "./mock-data";

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

function mapTestimonial(raw: Record<string, unknown>): Testimonial {
  const t = flatten(raw);
  return {
    id: (t.id as number) ?? 0,
    name: (t.name as string) ?? "",
    role: (t.role as string) ?? "",
    quote: (t.quote as string) ?? "",
    rating: Number(t.rating ?? 5),
    avatar: normalizeImage(t.avatar as StrapiMedia),
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

export async function getTestimonials(): Promise<Testimonial[]> {
  const json = await strapiFetch<StrapiList<Record<string, unknown>>>(
    "/testimonials?populate=avatar&pagination[pageSize]=50"
  );
  if (!json?.data?.length) return mockTestimonials;
  return json.data.map(mapTestimonial);
}
