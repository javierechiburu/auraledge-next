import Link from "next/link";
import { Product } from "@/lib/types";
import ProductCard from "@/components/beats/ProductCard";

export default function Collection({ products }: { products: Product[] }) {
  return (
    <section
      id="collection"
      className="mx-auto max-w-[1280px] scroll-mt-24 px-6 py-[70px]"
    >
      <div className="mx-auto mb-11 max-w-[640px] text-center">
        <h2 className="font-display mb-3.5 text-[clamp(28px,4vw,44px)] normal-case">
          Todos los <span className="text-grad">Beats</span> disponibles
        </h2>
        <p className="text-[15px] text-muted">
          Explora nuestra colección de beats y encuentra el ritmo perfecto para
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link href="/beats" className="btn btn-outline">
          Ver toda la colección
        </Link>
      </div>
    </section>
  );
}
