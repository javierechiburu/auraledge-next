"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { WAVEFORM } from "@/lib/waveform";
import AddToCartButton from "./AddToCartButton";

export default function BestValue({ product: s }: { product: Product }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!s) return null;

  const [dollars, cents] = s.price.toFixed(2).split(".");

  return (
    <section
      id="feature"
      className="mx-auto max-w-[1280px] scroll-mt-24 px-6 py-[70px]"
    >
      <h2 className="font-display relative z-0 mb-[-40px] text-center text-[clamp(48px,9vw,120px)] tracking-[2px] text-[rgba(255,176,32,.1)]">
        ÚLTIMO BEAT
      </h2>

      <div className="relative z-1 p-6 md:p-8">
        <div className="scroll-reveal-right relative overflow-hidden rounded-[32px] bg-amber p-[1.5px] shadow-[0_30px_80px_-30px_rgba(0,0,0,.8)] transition-transform duration-500 ease-out hover:scale-[1.01]">
          {/* Vinilo: ocupa todo el alto de la card y sangra por el borde derecho */}
          <div className="pointer-events-none absolute inset-y-0 right-20 top-10 z-10 hidden aspect-video h-full -translate-y-1/2 translate-x-1/2 md:block">
            <Image
              src="/assets/vinilo.png"
              alt={s.name}
              width={900}
              height={900}
              sizes="900px"
              style={{ animationPlayState: isPlaying ? "running" : "paused" }}
              className="animate-spin-slow object-contain drop-shadow-[0_0_50px_rgba(255,176,32,.35)]"
            />
            <button
              type="button"
              onClick={() => setIsPlaying((p) => !p)}
              aria-label={isPlaying ? "Pause preview" : "Play preview"}
              aria-pressed={isPlaying}
              className="pointer-events-auto absolute left-[45%] top-73 grid translate-y-1/2 cursor-pointer place-items-center"
            >
              <div
                className={`grid h-16 w-16 place-items-center rounded-full bg-grad transition-transform duration-200 hover:scale-105 active:scale-95 ${
                  isPlaying
                    ? "animate-neon-pulse"
                    : "shadow-[0_0_14px_2px_rgba(255,176,32,.4)]"
                }`}
              >
                {isPlaying ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 fill-[#1a0a00]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 fill-[#1a0a00]"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </button>
          </div>

          <div className="relative overflow-hidden rounded-[31px]  p-8 md:p-12">
            {/* Resplandores decorativos */}

            <div className="relative flex flex-col items-center justify-between gap-10 md:flex-row">
              {/* Izquierda */}
              <div className="max-w-md text-center md:text-left">
                <span className="inline-block rounded-full bg-grad px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-[#1a0a00]">
                  {s.badge || "Best Value"}
                </span>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  <h3 className="font-display text-4xl leading-tight text-white md:text-5xl">
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
                <div className="mt-8 flex items-center justify-center gap-4 md:justify-start">
                  <span className="text-4xl font-bold text-white">
                    ${dollars}
                    <sup className="text-lg text-amber">.{cents}</sup>
                  </span>
                  <span className="rounded-full border border-amber/30 bg-amber/10 px-4 py-1 text-sm text-amber">
                    {s.subtitle}
                  </span>
                </div>

                {/* Botones */}
                <div className="mt-8 flex justify-center gap-4 md:justify-start">
                  <AddToCartButton
                    product={s}
                    label="Agregar al carrito"
                    className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/10"
                  />
                  <Link
                    href={`/products/${s.slug}`}
                    className="rounded-xl bg-grad px-6 py-3 font-semibold text-[#1a0a00] transition hover:scale-105 hover:brightness-110"
                  >
                    Comprar ahora
                  </Link>
                </div>
              </div>

              {/* Vinilo (compacto, solo móvil; en desktop se usa el vinilo que sangra por el borde) */}
              <div className="relative shrink-0 md:hidden">
                <div className="relative h-64 w-64">
                  <Image
                    src="/assets/vinilo.png"
                    alt={s.name}
                    fill
                    sizes="820px"
                    style={{
                      animationPlayState: isPlaying ? "running" : "paused",
                    }}
                    className="absolute animate-spin-slow object-contain w-75"
                  />
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    aria-label={isPlaying ? "Pause preview" : "Play preview"}
                    aria-pressed={isPlaying}
                    className="absolute inset-0 grid cursor-pointer place-items-center"
                  >
                    <div
                      className={`grid h-16 w-16 place-items-center rounded-full bg-grad transition-transform duration-200 hover:scale-105 active:scale-95 ${
                        isPlaying
                          ? "animate-neon-pulse"
                          : "shadow-[0_0_14px_2px_rgba(255,176,32,.4)]"
                      }`}
                    >
                      {isPlaying ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 fill-[#1a0a00]"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 fill-[#1a0a00]"
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
        </div>
      </div>
    </section>
  );
}
