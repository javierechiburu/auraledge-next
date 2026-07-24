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
        className="font-display pointer-events-none absolute inset-x-0 top-[100px] z-[1] select-none text-center text-[clamp(80px,9vw,220px)] uppercase leading-[0.85] tracking-tight bg-[linear-gradient(180deg,#7a0d00_0%,#c81a00_40%,#ff4d10_70%,#ff7a18_100%)] bg-clip-text text-transparent"
      >
        Genio Music
      </h1>

      {/* Silueta central — centrada horizontalmente, anclada al borde inferior */}
      <div className="absolute inset-x-0 bottom-[130px] z-[2] flex justify-center lg:bottom-0">
        <div className="relative h-[min(72vh,98vw,600px)] w-[min(72vh,98vw,600px)] lg:h-[min(75vh,36vw,480px)] lg:w-[min(75vh,36vw,480px)]">
          <Image
            src="/assets/silueta.png"
            alt="Person wearing headphones with ambient glow"
            fill
            sizes="(max-width: 1024px) 90vw, 700px"
            className="object-contain object-bottom"
            priority
          />
          {/* Anillo concéntrico sobre el audífono de la silueta (centro real de la imagen: ~57%, 37%) */}
          <div className="animate-ring-bounce-glow absolute left-[70%] top-[50%] z-3 h-25 w-25 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 border-amber shadow-[0_0_50px_rgba(255,180,40,.7),inset_0_0_30px_rgba(255,180,40,.4)] lg:h-32.5 lg:w-32.5 lg:border-10" />
          <div className="animate-ring-bounce-fade absolute left-[75%] top-[55%] z-2 h-35 w-35 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-amber/30 lg:h-45 lg:w-45" />
        </div>
      </div>

      {/* Cards superpuestas — posicionadas absolutamente sobre la silueta */}
      <div className="absolute inset-x-0 bottom-0 z-[4] mx-auto max-w-[1280px] px-0  md:px-6 pb-6 lg:pb-10">
        {/* Bottom bar: rating + explore + customers */}
        <div className="my-7 flex flex-wrap items-center justify-between gap-4">
          {/* Rating */}
          <div className="flex items-center gap-3">
            <span className="text-[28px] font-extrabold">5.0</span>
            <div>
              <div className="text-sm tracking-[2px] text-amber">★★★★★</div>
              <div className="flex items-center">
                <span className="h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 grid h-[24px] w-[24px] place-items-center rounded-full border-2 border-bg bg-grad text-[10px] font-bold text-[#1a0a00]">
                  +
                </span>
              </div>
            </div>
          </div>

          {/* Explore Collection */}
          <a
            href="#collection"
            className="absolute bottom-0 flex items-center justify-center w-full bg-black py-3 text-sm font-semibold"
          >
            Explorar colección ↗
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
