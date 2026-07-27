/**
 * Categorías de producto. `label` es el valor guardado en Strapi (campo
 * `category`); `slug` se usa en la URL (`/beats?categoria=<slug>`).
 */
export interface Category {
  label: string;
  slug: string;
}

export const CATEGORIES: Category[] = [
  { label: "Plantillas vocales", slug: "plantillas-vocales" },
  { label: "Plantillas mezcla beats", slug: "plantillas-mezcla-beats" },
  { label: "Plantillas masterización", slug: "plantillas-masterizacion" },
];

export function categoryBySlug(slug?: string | null): Category | null {
  if (!slug) return null;
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function slugOfCategory(label?: string | null): string | null {
  if (!label) return null;
  return CATEGORIES.find((c) => c.label === label)?.slug ?? null;
}
