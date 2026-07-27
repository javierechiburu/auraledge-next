import Link from "next/link";
import { Product } from "@/lib/types";
import ProductMedia from "@/components/product/ProductMedia";
import AddToCartButton from "@/components/shared/AddToCartButton";
import AudioPreview from "@/components/shared/AudioPreview";

export default function ProductDetail({ product }: { product: Product }) {
  const meta = [
    product.genre,
    product.bpm ? `${product.bpm} BPM` : null,
    product.musicalKey,
    ...product.features,
  ].filter(Boolean) as string[];

  return (
    <section className="mx-auto grid max-w-[1280px] items-center gap-[50px] px-6 pb-[70px] pt-32 lg:grid-cols-2">
      <div className="relative h-[460px] overflow-hidden rounded-[22px] product-fill shadow-glow after:absolute after:inset-0 after:bg-[radial-gradient(200px_260px_at_50%_60%,rgba(0,0,0,.7),transparent_70%)] after:content-['']">
        <ProductMedia image={product.image} sizes="(max-width:960px) 100vw, 600px" />
      </div>

      <div>
        {product.tag && (
          <span className="mb-[18px] inline-block rounded-full bg-grad px-3.5 py-1.5 text-xs font-semibold text-[#1a0a00]">
            {product.tag}
          </span>
        )}
        <h1 className="mb-[18px] text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.1]">
          {product.name}
        </h1>
        <p className="mb-6 max-w-[480px] text-[15px] text-muted">{product.description}</p>

        <AudioPreview
          src={product.previewUrl}
          maxSeconds={product.previewSeconds ?? 30}
          className="mb-6 max-w-[480px] text-white"
        />

        <div className="mb-6 flex flex-wrap gap-2">
          {meta.map((f) => (
            <span key={f} className="chip">
              {f}
            </span>
          ))}
        </div>

        <div className="mb-[26px] flex items-center gap-5">
          <span className="text-[34px] font-extrabold text-grad">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-muted line-through">${product.compareAtPrice.toFixed(2)}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AddToCartButton product={product} label="Add To Cart 🛒" className="btn btn-primary" />
          <Link href="/beats" className="btn btn-outline">
            ← Volver
          </Link>
        </div>
      </div>
    </section>
  );
}
