"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, X, ArrowUpRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

function clp(n: number) {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, total, count } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-90 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />
      <aside
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-100 flex h-full w-[min(400px,92vw)] flex-col border-l border-line bg-bg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line p-5">
          <h3 className="flex items-center gap-2 text-[16px] font-semibold text-ink">
            <ShoppingCart size={18} className="text-accent" />
            Mi carrito ({count})
          </h3>
          <button
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="grid h-8 w-8 place-items-center text-muted transition-colors hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-5">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-muted">Tu carrito está vacío.</p>
          ) : (
            items.map((it) => (
              <div key={it.slug} className="flex items-center gap-3 border-b border-line py-4">
                <div
                  className="h-14 w-14 shrink-0 bg-panel bg-cover bg-center grayscale"
                  style={it.image ? { backgroundImage: `url(${it.image})` } : undefined}
                />
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm text-ink">{it.name}</strong>
                  <span className="text-[13px] tabular-nums text-muted">{clp(it.price)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setQty(it.slug, it.qty - 1)}
                    aria-label="Quitar uno"
                    className="grid h-7 w-7 place-items-center border border-line text-accent transition-colors hover:bg-white/5"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-5 text-center text-sm tabular-nums text-ink">{it.qty}</span>
                  <button
                    onClick={() => setQty(it.slug, it.qty + 1)}
                    aria-label="Agregar uno"
                    className="grid h-7 w-7 place-items-center border border-line text-accent transition-colors hover:bg-white/5"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(it.slug)}
                  aria-label="Quitar del carrito"
                  className="text-muted transition-colors hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-line p-5">
            <div className="flex items-center justify-between text-[16px] font-semibold text-ink">
              <span>Total</span>
              <span className="tabular-nums">{clp(total)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart} className="btn btn-primary justify-center">
              Ir a pagar <ArrowUpRight size={18} />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
