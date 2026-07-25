"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const OFFSETS: Record<string, gsap.TweenVars> = {
  right: { x: 80, y: 0 },
  left: { x: -80, y: 0 },
  up: { x: 0, y: 80 },
  down: { x: 0, y: -80 },
};

export default function ScrollReveal({
  children,
  direction = "up",
  className,
}: {
  children: React.ReactNode;
  direction?: "right" | "left" | "up" | "down";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.from(el, {
        ...OFFSETS[direction],
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    });

    return () => ctx.revert();
  }, [direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
