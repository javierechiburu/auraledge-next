"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { WAVEFORM } from "@/lib/waveform";
import AddToCartButton from "@/components/shared/AddToCartButton";
import ScrollReveal from "@/components/shared/ScrollReveal";

export default function BestValue({ product: s }: { product: Product }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!s) return null;

  const [dollars] = s.price.toFixed(2).split(".");

  return (
    <section
      id="feature"
      className="mx-auto max-w-[1280px] scroll-mt-24 px-6 py-10 md:py-17.5"
    >
      <h2 className="font-orbitron font-extrabold leading-[0.9] tracking-tighter relative z-0 mb-[-20px] text-center text-[clamp(48px,9vw,120px)] text-[rgba(255,176,32,.1)]">
        ÚLTIMO BEAT
      </h2>

      <div className="relative p-0 z-1 md:p-8">
        {/* Card dividida en diagonal: mitad negra (contenido) / mitad amarilla (vinilo) */}
        <div className="relative overflow-hidden bg-[linear-gradient(115deg,#141417_0%,#141417_55%,#ffcf2e_55%,#ffcf2e_100%)] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)] transition-transform duration-500 ease-out hover:scale-[1.01]">
          {/* Vinilo: ocupa todo el alto de la card y sangra por el borde derecho */}
          <ScrollReveal
            direction="left"
            distance={-480}
            duration={1.2}
            delay={0.5}
            className="pointer-events-none absolute inset-y-0 right-12 top-10 z-10 hidden aspect-video h-full -translate-y-1/2 translate-x-1/2 md:block"
          >
            <>
              <Image
                src="/assets/vinilo.png"
                alt={s.name}
                width={900}
                height={900}
                style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                className="animate-spin-slow object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,.4)]"
              />
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? "Pause preview" : "Play preview"}
                aria-pressed={isPlaying}
                className="pointer-events-auto absolute left-[45%] top-59 grid translate-y-1/2 cursor-pointer place-items-center"
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-black shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95">
                  {isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 fill-accent"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 fill-accent"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </div>
              </button>
            </>
          </ScrollReveal>

          <div className="relative p-6 pb-38 md:p-12">
            <div className="relative z-1 flex flex-col items-center justify-between gap-10 md:flex-row">
              {/* Izquierda */}
              <div className="max-w-md text-center md:text-left">
                <span className="inline-block bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-accent">
                  {s.badge || "Best Value"}
                </span>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 2xl:justify-start">
                  <h3 className="font-orbitron font-extrabold leading-[0.9] tracking-tighter text-4xl text-white md:text-5xl">
                    {s.name}
                  </h3>
                  <div className="flex h-8 items-end gap-[2px]">
                    {WAVEFORM.slice(0, 14).map((h, i) => (
                      <span
                        key={i}
                        style={{
                          height: `${h}%`,
                          animationDelay: `${(i % 8) * 0.09}s`,
                          animationPlayState: isPlaying ? "running" : "paused",
                        }}
                        className="animate-bar-bounce w-[3px] origin-bottom rounded-full bg-white/60"
                      />
                    ))}
                  </div>
                </div>
                {/* Precio */}
                <div className="mt-0 flex items-center justify-center gap-4 md:mt-8 2xl:justify-start">
                  <span className="text-4xl font-bold text-white">
                    ${dollars}
                  </span>
                  <span className="border border-white/15 bg-white/5 px-4 py-1 text-sm text-white">
                    {s.subtitle}
                  </span>
                </div>

                {/* Botones */}
                <div className="mt-0 flex flex-col gap-3 md:mt-8 md:flex-row md:gap-4 md:justify-start">
                  <AddToCartButton
                    product={s}
                    label="Agregar al carrito"
                    className="w-full justify-center border border-white/15 bg-white/5 px-6 py-3 text-center font-semibold text-white backdrop-blur transition hover:bg-white/10 md:w-auto"
                  />
                  <Link
                    href={`/beats/${s.slug}`}
                    className="w-full bg-black px-6 py-3 text-center font-semibold text-accent transition hover:brightness-125 md:w-auto"
                  >
                    Comprar ahora
                  </Link>
                </div>
              </div>
            </div>

            {/* Vinilo (solo móvil): absolute y sangrando por el borde inferior de la card */}
            <div className="absolute bottom-0 left-1/2 z-0 h-[64vw] w-[64vw] max-h-64 max-w-64 -translate-x-1/2 translate-y-1/2 md:hidden">
              <Image
                src="/assets/vinilo.png"
                alt={s.name}
                fill
                sizes="480px"
                style={{ animationPlayState: isPlaying ? "running" : "paused" }}
                className="animate-spin-slow object-contain"
              />
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? "Pause preview" : "Play preview"}
                aria-pressed={isPlaying}
                className="absolute inset-0 grid cursor-pointer place-items-center"
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-black shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95">
                  {isPlaying ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 fill-accent"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 fill-accent"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
