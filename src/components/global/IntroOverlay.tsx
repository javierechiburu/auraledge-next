"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function IntroOverlay() {
  const [visible, setVisible] = useState(true);

  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!overlayRef.current || !logoRef.current || !dotRef.current) return;

    document.body.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          document.body.style.overflow = "";
          setVisible(false);
        },
      });

      // Estado inicial antes de comenzar

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

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="intro-mask fixed inset-0 z-[200] grid place-items-center bg-black"
    >
      <div ref={logoRef} className="flex flex-col items-center gap-4">
        <img
          src="/assets/logo-bg.png"
          alt="GENIOMUSIC"
          className="h-64 w-64 rounded-full md:h-200 md:w-120"
        />
      </div>

      <div
        ref={dotRef}
        className="absolute h-3 w-3 opacity-0 rounded-full bg-amber shadow-[0_0_20px_6px_rgba(255,176,32,.8)]"
      />
    </div>
  );
}
