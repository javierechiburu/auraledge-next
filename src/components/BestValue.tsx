"use client";

import { useCallback, useEffect, useState } from "react";
import { Product } from "@/lib/types";
import ProductMedia from "./ProductMedia";
import AddToCartButton from "./AddToCartButton";

export default function BestValue({ products }: { products: Product[] }) {
  const slides = products.length ? products : [];
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [next, slides.length]);

  if (!slides.length) return null;
  const s = slides[index];
  const [dollars, cents] = s.price.toFixed(2).split(".");

  return (
    <section id="feature" className="mx-auto max-w-[1280px] scroll-mt-24 px-6 py-[70px]">
      <h2 className="relative z-0 mb-[-40px] text-center text-[clamp(48px,9vw,120px)] font-black tracking-[2px] text-[rgba(255,120,30,.1)]">
        BEST VALUE
      </h2>
      <div className="relative z-[1] flex items-center gap-4">
        <button
          onClick={prev}
          aria-label="previous"
          className="grid h-[46px] w-[46px] place-items-center rounded-xl bg-grad text-2xl text-[#1a0a00] transition hover:scale-105"
        >
          ‹
        </button>
        <div className="flex-1 overflow-hidden">
          <article className="relative grid items-center gap-[26px] overflow-hidden rounded-[22px] border border-line surface-value p-7 md:grid-cols-[1.2fr_1.4fr_auto]">
            {s.badge && (
              <span className="absolute right-5 top-5 rounded-full bg-grad px-3 py-1.5 text-[13px] font-bold text-[#1a0a00]">
                {s.badge}
              </span>
            )}
            <div className="relative h-[180px] overflow-hidden rounded-2xl product-fill">
              <ProductMedia image={s.image} sizes="300px" />
            </div>
            <div>
              <h3 className="mb-2 text-[26px] font-bold">{s.name}</h3>
              <p className="mb-3.5 text-sm text-muted">{s.subtitle}</p>
              <div className="flex flex-wrap gap-2">
                {s.features.map((f) => (
                  <span key={f} className="chip text-[12px] text-ink">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-center">
              <span className="mb-3.5 block text-[34px] font-extrabold text-grad">
                ${dollars}
                <sup className="text-[15px]">.{cents}</sup>
              </span>
              <AddToCartButton product={s} label="Add To Cart" className="btn btn-primary btn-xs" />
            </div>
          </article>
        </div>
        <button
          onClick={next}
          aria-label="next"
          className="grid h-[46px] w-[46px] place-items-center rounded-xl bg-grad text-2xl text-[#1a0a00] transition hover:scale-105"
        >
          ›
        </button>
      </div>
    </section>
  );
}
