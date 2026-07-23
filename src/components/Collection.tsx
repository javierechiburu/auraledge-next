import { Product } from "@/lib/types";
import ProductMedia from "./ProductMedia";
import AddToCartButton from "./AddToCartButton";

function PriceTag({ price }: { price: number }) {
  const [dollars, cents] = price.toFixed(2).split(".");
  return (
    <span className="text-[22px] font-extrabold text-grad">
      ${dollars}
      <sup className="text-[12px]">.{cents}</sup>
    </span>
  );
}

export default function Collection({ products }: { products: Product[] }) {
  return (
    <section id="collection" className="mx-auto max-w-[1280px] scroll-mt-24 px-6 py-[70px]">
      <div className="mx-auto mb-11 max-w-[640px] text-center">
        <h2 className="mb-3.5 text-[clamp(28px,4vw,44px)] font-extrabold">
          Discover Our <span className="text-grad">Collection</span>
        </h2>
        <p className="text-[15px] text-muted">
          Find the perfect pair that matches your lifestyle, passion, and sound preferences.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[22px]">
        {products.map((p) => (
          <article
            key={p.slug}
            className="rounded-[22px] border border-line surface-card p-[18px] transition duration-200 hover:-translate-y-1.5 hover:border-[rgba(255,120,30,.4)]"
          >
            <div className="relative mb-4 h-[200px] overflow-hidden rounded-2xl product-fill">
              {p.tag && (
                <span className="absolute left-3.5 top-3.5 z-[2] rounded-full border border-line bg-panel px-[11px] py-[5px] text-[11px] font-semibold">
                  {p.tag}
                </span>
              )}
              <ProductMedia image={p.image} sizes="(max-width:768px) 100vw, 260px" />
            </div>
            <h3 className="mb-1 text-[19px] font-bold">{p.name}</h3>
            <div className="mb-3 text-[12.5px] text-muted">{p.subtitle}</div>
            <div className="mb-4 flex flex-wrap gap-2">
              {p.features.map((f) => (
                <span key={f} className="chip">
                  {f}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <PriceTag price={p.price} />
              <AddToCartButton product={p} label="Buy Now" className="btn btn-primary btn-xs" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a href="#collection" className="btn btn-outline">
          View All Collection
        </a>
      </div>
    </section>
  );
}
