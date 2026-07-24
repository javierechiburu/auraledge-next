"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, SkipBack, SkipForward, Star } from "lucide-react";
import { Product } from "@/lib/types";
import { WAVEFORM } from "@/lib/waveform";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product: p }: { product: Product }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const rating = 4;

  return (
    <article className="scroll-reveal group relative overflow-hidden rounded-[28px] border-[5px] border-card bg-gradient-to-br from-panel to-black shadow-2xl transition duration-300 hover:-translate-y-1.5">
      {/* Precio */}
      <div className="absolute right-0 top-0 z-20 rounded-bl-2xl bg-grad px-4 py-2 text-lg font-bold text-[#1a0a00]">
        ${Math.round(p.price)}
      </div>

      {/* Cover + vinilo */}
      <div className="relative flex justify-center pt-5">
        <div className="relative z-10 aspect-video w-[80%] overflow-hidden rounded-[18px]">
          <Image
            src="/assets/play-vinilo.png"
            alt={p.name}
            fill
            sizes="(max-width:768px) 80vw, 320px"
            className="object-cover brightness-75"
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-3 text-center">
            <div className="flex h-3.5 items-end gap-0.5">
              {WAVEFORM.slice(0, 12).map((h, i) => (
                <span
                  key={i}
                  style={{
                    height: `${h}%`,
                    animationDelay: `${(i % 8) * 0.09}s`,
                    animationPlayState: isPlaying ? "running" : "paused",
                  }}
                  className="animate-bar-bounce w-[2px] origin-bottom rounded-full bg-amber/80"
                />
              ))}
            </div>
            <p className="font-display text-sm leading-none text-white">
              {p.name}
            </p>
          </div>
        </div>
      </div>

      {/* Player */}
      <section className="px-5 pt-4">
        <div className="mt-4 flex items-center justify-center gap-5">
          <SkipBack className="text-muted" size={18} />

          <button
            type="button"
            onClick={() => setIsPlaying((v) => !v)}
            aria-label={isPlaying ? "Pause preview" : "Play preview"}
            aria-pressed={isPlaying}
            className={`grid h-10 w-10 cursor-pointer place-items-center rounded-full bg-white shadow-xl transition hover:scale-105 active:scale-95 ${
              isPlaying ? "animate-neon-pulse" : ""
            }`}
          >
            {isPlaying ? (
              <Pause className="fill-brand-2 text-brand-2" size={18} />
            ) : (
              <Play className="fill-brand-2 text-brand-2" size={18} />
            )}
          </button>

          <SkipForward className="text-muted" size={18} />
        </div>
      </section>

      {/* Info + compra */}
      <section className="mt-4 border-t border-line bg-black/60 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-lg leading-none text-white">
              {p.name}
            </h3>
            <p className="mt-1.5 line-clamp-1 text-xs text-muted">
              {p.description}
            </p>
          </div>

          <div className="flex shrink-0 gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < rating ? "fill-amber text-amber" : "text-muted"}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-2.5">
          <AddToCartButton
            product={p}
            label="Agregar al carrito"
            className="btn btn-primary btn-sm flex-1 justify-center"
          />
        </div>
      </section>
    </article>
  );
}
