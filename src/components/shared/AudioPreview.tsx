"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { WAVEFORM } from "@/lib/waveform";

/**
 * Reproductor de PREVIEW. Reproduce únicamente el clip público (`src`) y, como
 * defensa extra, corta la reproducción al llegar a `maxSeconds` aunque el
 * archivo fuera más largo. Nunca recibe ni reproduce la pista completa.
 */
export default function AudioPreview({
  src,
  maxSeconds = 30,
  className = "",
}: {
  src?: string | null;
  maxSeconds?: number;
  className?: string;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    function onTime() {
      if (!audio) return;
      const cap = maxSeconds;
      if (audio.currentTime >= cap) {
        audio.pause();
        audio.currentTime = 0;
        setPlaying(false);
        setProgress(0);
        return;
      }
      setProgress(Math.min(1, audio.currentTime / cap));
    }
    function onEnded() {
      setPlaying(false);
      setProgress(0);
    }

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [maxSeconds]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio || !src) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      void audio.play();
      setPlaying(true);
    }
  }

  if (!src) {
    return (
      <div className={`flex items-center gap-3 opacity-50 ${className}`}>
        <span className="text-xs text-muted">Preview no disponible</span>
      </div>
    );
  }

  const activeBars = Math.round(progress * WAVEFORM.length);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <audio ref={audioRef} src={src} preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pausar preview" : "Reproducir preview"}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-grad text-[#1a0a00] transition hover:scale-105"
      >
        {playing ? <Pause size={18} /> : <Play size={18} className="translate-x-[1px]" />}
      </button>

      <div className="flex h-8 flex-1 items-end gap-[3px]" aria-hidden>
        {WAVEFORM.map((h, i) => (
          <span
            key={i}
            className="w-full rounded-sm transition-colors"
            style={{
              height: `${h}%`,
              backgroundColor: i < activeBars ? "currentColor" : "rgba(255,255,255,.18)",
            }}
          />
        ))}
      </div>

      <span className="shrink-0 text-[11px] tabular-nums text-muted">
        {maxSeconds}s preview
      </span>
    </div>
  );
}
