import { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function BeatsGrid({
  products,
  total,
}: {
  products: Product[];
  total: number;
}) {
  return (
    <div>
      <p className="mb-6 text-sm text-muted">
        Mostrando {products.length} de {total} beats
      </p>

      {products.length === 0 ? (
        <div className="rounded-[22px] border border-line bg-card p-12 text-center text-muted">
          No encontramos beats con esos filtros.
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
