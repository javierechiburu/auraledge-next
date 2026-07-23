"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#feature", label: "Feature" },
  { href: "#highlight", label: "Highlight Product" },
  { href: "#collection", label: "Collection" },
  { href: "#testimonials", label: "Testimonials" },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      let cur = "top";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) cur = id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-black/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center gap-6 px-6 py-4">
        <a
          href="#top"
          className="flex items-center gap-2 text-[19px] font-extrabold tracking-wide"
        >
          <Image
            src="/assets/logo.jpg"
            alt="AURALEDGE logo"
            width={30}
            height={30}
            className="rounded-full"
          />
          AURALEDGE
        </a>

        <nav
          className={`${
            open
              ? "absolute inset-x-0 top-full flex flex-col gap-4 border-b border-line bg-card p-6"
              : "hidden"
          } lg:ml-3.5 lg:flex lg:flex-1 lg:flex-row lg:items-center lg:gap-6 lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {LINKS.map((l) => {
            const isActive = active === l.href.slice(1);
            return (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`relative text-[14.5px] font-medium transition-colors ${
                  isActive
                    ? "text-ink after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-0.5 after:rounded after:bg-grad"
                    : "text-muted hover:text-ink"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <button
            onClick={openCart}
            aria-label="cart"
            className="relative rounded-xl border border-line bg-panel px-3.5 py-2.5 text-base"
          >
            🛒
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-[20px] place-items-center rounded-full bg-grad px-1.5 text-[11px] font-bold text-[#1a0a00]">
                {count}
              </span>
            )}
          </button>

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="menu"
            className="rounded-lg border border-line px-3 py-1.5 text-xl lg:hidden"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
