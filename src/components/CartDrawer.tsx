"use client";

import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, setQty, removeItem, total, count } = useCart();

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      />
      <aside
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-[100] flex h-full w-[min(400px,92vw)] flex-col border-l border-line bg-card transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line p-[22px]">
          <h3 className="text-[18px] font-bold">Your Cart ({count})</h3>
          <button onClick={closeCart} aria-label="close" className="text-[22px]">
            ✕
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-[18px_22px]">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-muted">Your cart is empty.</p>
          ) : (
            items.map((it) => (
              <div key={it.slug} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                <div
                  className="h-14 w-14 flex-shrink-0 rounded-[10px] product-fill"
                  style={
                    it.image
                      ? { backgroundImage: `url(${it.image})`, backgroundSize: "cover" }
                      : undefined
                  }
                />
                <div className="min-w-0 flex-1">
                  <strong className="block truncate text-sm">{it.name}</strong>
                  <span className="text-[13px] text-muted">${it.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(it.slug, it.qty - 1)}
                    className="h-[26px] w-[26px] rounded-lg border border-line bg-panel text-[15px]"
                  >
                    −
                  </button>
                  <span>{it.qty}</span>
                  <button
                    onClick={() => setQty(it.slug, it.qty + 1)}
                    className="h-[26px] w-[26px] rounded-lg border border-line bg-panel text-[15px]"
                  >
                    +
                  </button>
                </div>
                <button onClick={() => removeItem(it.slug)} aria-label="remove" className="text-base text-muted">
                  🗑
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-3.5 border-t border-line p-[22px]">
            <div className="flex justify-between text-[17px] font-bold">
              <span>Total</span>
              <span className="text-grad">${total.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary justify-center">
              Checkout <span className="btn-ic">↗</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
