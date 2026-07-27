import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { Product } from "@/lib/types";
import ProductMedia from "@/components/product/ProductMedia";
import AddToCartButton from "@/components/shared/AddToCartButton";
import AudioPreview from "@/components/shared/AudioPreview";

function clp(n: number) {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

export default function ProductDetail({ product }: { product: Product }) {
  const meta = [
    product.genre,
    product.bpm ? `${product.bpm} BPM` : null,
    product.musicalKey,
    ...product.features,
  ].filter(Boolean) as string[];

  return (
    <section className="mx-auto grid max-w-[1280px] items-start gap-10 px-6 pb-16 pt-32 lg:grid-cols-2">
      {/* Portada */}
      <div className="relative aspect-square overflow-hidden border border-line bg-[#0d0d0f]">
        <Image
          src="/assets/play-vinilo.png"
          alt=""
          fill
          sizes="(max-width:960px) 100vw, 600px"
          className="object-cover opacity-90 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <ProductMedia image={product.image} sizes="(max-width:960px) 100vw, 600px" />
      </div>

      {/* Info */}
      <div>
        {product.tag && (
          <span className="mb-4 inline-block border border-accent px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            {product.tag}
          </span>
        )}
        <h1 className="mb-4 text-[clamp(28px,3.6vw,44px)] font-semibold leading-[1.1] tracking-tight text-ink">
          {product.name}
        </h1>
        <p className="mb-6 max-w-[480px] text-[15px] leading-relaxed text-muted">
          {product.description}
        </p>

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

        <div className="mb-7 flex items-center gap-4">
          <span className="text-[32px] font-semibold tabular-nums text-ink">{clp(product.price)}</span>
          {product.compareAtPrice && (
            <span className="tabular-nums text-muted line-through">{clp(product.compareAtPrice)}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AddToCartButton
            product={product}
            ariaLabel={`Agregar ${product.name} al carrito`}
            className="btn btn-primary"
          >
            <ShoppingCart size={18} /> Agregar al carrito
          </AddToCartButton>
          <Link href="/beats" className="btn btn-outline">
            <ArrowLeft size={16} /> Volver
          </Link>
        </div>
      </div>
    </section>
  );
}
