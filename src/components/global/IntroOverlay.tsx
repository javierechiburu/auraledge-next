"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function IntroOverlay() {
  const [visible, setVisible] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (!overlayRef.current || !logoRef.current || !dotRef.current) return;

    document.body.style.overflow = "hidden";

    let ctx: gsap.Context | undefined;
    let cancelled = false;

    // La animación no arranca hasta que la imagen del logo esté lista.
    const runTimeline = () => {
      if (cancelled || !overlayRef.current) return;

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            document.body.style.overflow = "";
            setVisible(false);
          },
        });

        tl.to(logoRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.75,
        })
          .to(logoRef.current, {
            opacity: 0,
            scale: 0.05,
            duration: 0.5,
            ease: "power2.in",
          })
          .to(
            dotRef.current,
            {
              opacity: 0,
              scale: 1,
              duration: 0.75,
            },
            "<",
          )
          .to(
            dotRef.current,
            {
              opacity: 1,
              scale: 1,
              duration: 0.75,
              ease: "back.out(1.8)",
            },
            "<",
          )
          .to(dotRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power1.out",
          })
          .to(
            overlayRef.current,
            {
              "--reveal-r": "100%",
              duration: 1.1,
              ease: "power4.inOut",
            },
            "<",
          );
      }, overlayRef);
    };

    // Espera a que el logo esté totalmente cargado y decodificado.
    const img = imgRef.current;
    if (img) {
      const start = () => runTimeline();
      if (img.complete && img.naturalWidth > 0) {
        // Ya en caché: nos aseguramos de que esté decodificada antes de animar.
        img.decode().then(start).catch(start);
      } else {
        img.addEventListener("load", start, { once: true });
        img.addEventListener("error", start, { once: true }); // no bloquear si falla
      }
    } else {
      runTimeline();
    }

    return () => {
      cancelled = true;
      ctx?.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="intro-mask fixed inset-0 z-[200] grid place-items-center bg-mist-900"
    >
      <div ref={logoRef} className="flex flex-col items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src="/assets/logo-mark.png"
          alt="GENIOMUSIC"
          className="h-auto w-[clamp(160px,34vw,320px)] max-h-[70vh] object-contain"
        />
      </div>

      <div
        ref={dotRef}
        className="absolute h-3 w-3 opacity-0 rounded-full bg-amber shadow-[0_0_20px_6px_rgba(255,176,32,.8)]"
      />
    </div>
  );
}
