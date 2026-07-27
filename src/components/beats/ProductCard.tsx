"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Pause, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/types";
import { WAVEFORM } from "@/lib/waveform";
import AddToCartButton from "@/components/shared/AddToCartButton";

function formatCLP(n: number) {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

export default function ProductCard({ product: p }: { product: Product }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const maxSeconds = p.previewSeconds ?? 30;

  const meta = [p.genre, p.bpm ? `${p.bpm} BPM` : null].filter(Boolean).join(" · ");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    function onTime() {
      if (!audio) return;
      if (audio.currentTime >= maxSeconds) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      }
    }
    function onEnded() {
      setIsPlaying(false);
    }
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [maxSeconds]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || !p.previewUrl) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      void audio.play();
      setIsPlaying(true);
    }
  }

  return (
    <article className="group relative flex flex-col border border-line bg-card transition-colors duration-200 hover:border-white/20">
      {/* Portada / cover */}
      <Link
        href={`/beats/${p.slug}`}
        className="relative block aspect-square overflow-hidden bg-[#0d0d0f]"
      >
        <Image
          src="/assets/play-vinilo.png"
          alt={p.name}
          fill
          sizes="(max-width:768px) 90vw, 300px"
          className="object-cover opacity-90 grayscale transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Botón play (overlay) */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            togglePlay();
          }}
          disabled={!p.previewUrl}
          aria-label={isPlaying ? "Pausar preview" : "Reproducir preview"}
          className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-full bg-accent text-black shadow-lg transition hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isPlaying ? (
            <Pause size={16} className="fill-black" />
          ) : (
            <Play size={16} className="translate-x-[1px] fill-black" />
          )}
        </button>

        {/* Waveform animada al reproducir */}
        <div className="absolute bottom-4 right-3 flex h-5 items-end gap-[2px]">
          {WAVEFORM.slice(0, 14).map((h, i) => (
            <span
              key={i}
              style={{
                height: `${h}%`,
                animationDelay: `${(i % 8) * 0.09}s`,
                animationPlayState: isPlaying ? "running" : "paused",
              }}
              className="animate-bar-bounce w-[2px] origin-bottom rounded-full bg-white/70"
            />
          ))}
        </div>
      </Link>

      {p.previewUrl && <audio ref={audioRef} src={p.previewUrl} preload="none" />}

      {/* Info + compra */}
      <div className="flex flex-col gap-3 p-4">
        <div className="min-w-0">
          <Link href={`/beats/${p.slug}`}>
            <h3 className="truncate text-[15px] font-semibold text-ink transition-colors hover:text-white">
              {p.name}
            </h3>
          </Link>
          {meta && (
            <p className="mt-1 truncate text-xs uppercase tracking-wide text-muted">{meta}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[15px] font-semibold tabular-nums text-ink">
            {formatCLP(p.price)}
          </span>

          <AddToCartButton
            product={p}
            ariaLabel={`Agregar ${p.name} al carrito`}
            className="grid h-10 w-10 place-items-center border border-line text-accent transition-colors hover:bg-accent hover:text-black"
          >
            <ShoppingCart size={17} />
          </AddToCartButton>
        </div>
      </div>
    </article>
  );
}
