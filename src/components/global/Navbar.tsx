"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Disc3, ShoppingCart, User, BarChart3, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const LINKS = [
  { href: "/#top", label: "Inicio", Icon: Home },
  { href: "/beats", label: "Beats", Icon: Disc3 },
];

export default function Navbar() {
  const { count, openCart } = useCart();
  const { user, loading, openAuth } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-white/6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-4">
        {/* Logo (izquierda) */}
        <Link href="/#top" className="font-display flex items-center gap-2 text-[17px] tracking-wide">
          <Image src="/assets/logo-bg.png" alt="GENIOMUSIC logo" width={28} height={28} className="rounded-full" />
          GENIOMUSIC
        </Link>

        {/* Menú (centrado) */}
        <nav
          className={`${
            open
              ? "absolute inset-x-0 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/90 p-3 backdrop-blur-xl"
              : "hidden"
          } lg:flex lg:flex-1 lg:flex-row lg:items-center lg:justify-center lg:gap-1 lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {LINKS.map(({ href, label, Icon }) => {
            const active = href === "/beats" && pathname?.startsWith("/beats");
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 rounded-full border border-transparent px-4 py-1.5 text-[14.5px] font-medium transition-colors hover:border-white/10 hover:bg-white/6 hover:text-ink ${
                  active ? "bg-white/8 text-ink" : "text-muted"
                }`}
              >
                <Icon size={16} className="text-accent" />
                {label}
              </Link>
            );
          })}

          {user?.isAdmin && (
            <Link
              href="/ventas"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-full border border-transparent px-4 py-1.5 text-[14.5px] font-medium text-muted transition-colors hover:border-white/10 hover:bg-white/6 hover:text-ink"
            >
              <BarChart3 size={16} className="text-accent" />
              Ventas
            </Link>
          )}
        </nav>

        {/* Acciones (derecha) */}
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <button
            onClick={openCart}
            aria-label="Carrito"
            className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/6 backdrop-blur-xl transition-colors hover:bg-white/10"
          >
            <ShoppingCart size={17} className="text-accent" />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
                {count}
              </span>
            )}
          </button>

          {!loading &&
            (user ? (
              <Link
                href="/perfil"
                aria-label="Mi perfil"
                title={user.email}
                className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/6 backdrop-blur-xl transition-colors hover:bg-white/10"
              >
                <User size={17} className="text-accent" />
              </Link>
            ) : (
              <button
                onClick={() => openAuth("login")}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/6 px-3.5 py-2 text-[14px] font-medium backdrop-blur-xl transition-colors hover:bg-white/10"
              >
                <User size={16} className="text-accent" />
                <span className="hidden sm:inline">Ingresar</span>
              </button>
            ))}

          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menú"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/6 backdrop-blur-xl transition-colors hover:bg-white/10 lg:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
