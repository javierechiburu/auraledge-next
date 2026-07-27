import { Product } from "@/lib/types";
import ProductCard from "@/components/beats/ProductCard";

/** Elige recomendados: primero mismo género, luego el resto. Excluye el actual. */
function pickRelated(current: Product, products: Product[], limit = 4): Product[] {
  const others = products.filter((p) => p.slug !== current.slug);
  const sameGenre = others.filter((p) => p.genre && p.genre === current.genre);
  const rest = others.filter((p) => !(p.genre && p.genre === current.genre));
  return [...sameGenre, ...rest].slice(0, limit);
}

export default function RelatedProducts({
  current,
  products,
}: {
  current: Product;
  products: Product[];
}) {
  const related = pickRelated(current, products);
  if (related.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-24 pt-4">
      <div className="mb-6 flex items-end justify-between border-t border-line pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-ink">También te puede gustar</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] sm:gap-4">
        {related.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}
