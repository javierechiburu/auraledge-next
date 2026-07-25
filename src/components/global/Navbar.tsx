"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const LINKS = [
  { href: "/#top", label: "Inicio" },
  { href: "/beats", label: "Beats" },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-white/6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">
        <Link
          href="/#top"
          className="font-display flex items-center gap-2 text-[17px] tracking-wide"
        >
          <Image
            src="/assets/logo-bg.png"
            alt="GENIOMUSIC logo"
            width={28}
            height={28}
            className="rounded-full"
          />
          GENIOMUSIC
        </Link>

        <nav
          className={`${
            open
              ? "absolute inset-x-0 top-full mt-2 flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/6 p-3 backdrop-blur-xl"
              : "hidden"
          } lg:ml-2 lg:flex lg:flex-1 lg:flex-row lg:items-center lg:gap-2 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none`}
        >
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-full border border-transparent px-3.5 py-1.5 text-[14.5px] font-medium text-muted transition-colors hover:border-white/10 hover:bg-white/6 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <button
            onClick={openCart}
            aria-label="cart"
            className="relative rounded-xl border border-white/10 bg-white/6 px-3.5 py-2 text-base backdrop-blur-xl transition-colors hover:bg-white/10"
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
            className="rounded-lg border border-white/10 bg-white/6 px-3 py-1.5 text-xl backdrop-blur-xl lg:hidden"
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
}
