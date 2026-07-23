import { Product } from "@/lib/types";
import Image from "next/image";
import ProductMedia from "./ProductMedia";
import AddToCartButton from "./AddToCartButton";

export default function Hero({ product }: { product: Product }) {
  return (
    <section
      id="top"
      className="relative min-h-[100vh] scroll-mt-24 overflow-hidden bg-[radial-gradient(circle_at_center,#ff7a18_0%,#ff4d10_20%,#c81a00_40%,#7a0d00_55%,#0a0705_100%)]"
    >
      {/* Texto de fondo "Genio Music" con gradiente naranja→amarillo */}
      <h1
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-[100px] z-[1] select-none text-center text-[clamp(80px,9vw,220px)] font-black uppercase leading-[0.85] tracking-tight bg-[linear-gradient(180deg,#7a0d00_0%,#c81a00_40%,#ff4d10_70%,#ff7a18_100%)] bg-clip-text text-transparent"
      >
        Genio Music
      </h1>

      {/* Silueta central — centrada horizontalmente, anclada al borde inferior */}
      <div className="absolute inset-x-0 bottom-0 z-[2] flex justify-center">
        <div className="relative h-[65vh] w-[min(420px,60%)] lg:h-[75vh] lg:w-[min(480px,36%)]">
          <Image
            src="/assets/silueta.png"
            alt="Person wearing headphones with ambient glow"
            fill
            sizes="(max-width: 1024px) 90vw, 700px"
            className="object-contain object-bottom"
            priority
          />
          {/* Anillo concéntrico sobre la cabeza */}
          <div className="absolute left-1/2 top-[28%] z-[3] h-[100px] w-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[8px] border-amber shadow-[0_0_50px_rgba(255,180,40,.7),inset_0_0_30px_rgba(255,180,40,.4)] lg:h-[130px] lg:w-[130px] lg:border-[10px]" />
          <div className="absolute left-1/2 top-[28%] z-[2] h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-amber/30 lg:h-[180px] lg:w-[180px]" />
        </div>
      </div>

      {/* Cards superpuestas — posicionadas absolutamente sobre la silueta */}
      <div className="absolute inset-x-0 bottom-0 z-[4] mx-auto max-w-[1280px] px-6 pb-6 lg:pb-10">
        {/* Bottom bar: rating + explore + customers */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          {/* Rating */}
          <div className="flex items-center gap-3">
            <span className="text-[28px] font-extrabold">5.0</span>
            <div>
              <div className="text-sm tracking-[2px] text-amber">★★★★★</div>
              <div className="my-0.5 flex items-center">
                <span className="h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 grid h-[24px] w-[24px] place-items-center rounded-full border-2 border-bg bg-grad text-[10px] font-bold text-[#1a0a00]">
                  +
                </span>
              </div>
              <small className="text-[10px] text-muted">Customer Ratings</small>
            </div>
          </div>

          {/* Explore Collection */}
          <a
            href="#collection"
            className="inline-flex items-center gap-2.5 rounded-[14px] border border-line bg-panel px-6 py-3 font-semibold text-sm"
          >
            Explore Collection
            <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-grad text-[#1a0a00] text-xs">
              ↗
            </span>
          </a>

          {/* Customers */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
              <span className="-ml-2 h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
              <span className="-ml-2 h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
            </div>
            <div>
              <strong className="block text-[16px]">30K+</strong>
              <small className="text-[10px] text-muted">Satisfied Customers Worldwide</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
