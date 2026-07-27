"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Direction = "left" | "right" | "up" | "down";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;

  direction?: Direction;
  distance?: number;

  duration?: number;
  delay?: number;
  ease?: string;

  start?: string;
  toggleActions?: string;
  once?: boolean;
};

export default function ScrollReveal({
  children,
  className,

  direction = "up",
  distance = 80,

  duration = 1,
  delay = 0,
  ease = "power3.out",

  start = "top 85%",
  toggleActions = "play none none none",
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const offsets: Record<Direction, gsap.TweenVars> = {
      left: { x: -distance, y: 0 },
      right: { x: distance, y: 0 },
      up: { x: 0, y: distance },
      down: { x: 0, y: -distance },
    };

    const ctx = gsap.context(() => {
      gsap.from(el, {
        ...offsets[direction],
        opacity: 0,
        duration,
        delay,
        ease,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions,
          once,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [direction, distance, duration, delay, ease, start, toggleActions, once]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
