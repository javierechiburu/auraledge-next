"use client";

import { CartItem } from "@/lib/types";

export default function CartLineItem({
  item,
  onQtyChange,
  onRemove,
}: {
  item: CartItem;
  onQtyChange: (qty: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-6 py-6 first:pt-0 last:pb-0">
      <div
        className="h-20 w-20 flex-shrink-0 rounded-2xl product-fill"
        style={
          item.image ? { backgroundImage: `url(${item.image})`, backgroundSize: "cover" } : undefined
        }
      />
      <div className="min-w-0 flex-1">
        <strong className="block truncate text-[15px]">{item.name}</strong>
        <span className="text-sm text-muted">${item.price.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => onQtyChange(item.qty - 1)}
          className="h-9 w-9 rounded-lg border border-line bg-panel text-base"
        >
          −
        </button>
        <span className="w-6 text-center">{item.qty}</span>
        <button
          type="button"
          onClick={() => onQtyChange(item.qty + 1)}
          className="h-9 w-9 rounded-lg border border-line bg-panel text-base"
        >
          +
        </button>
      </div>
      <span className="hidden w-20 text-right font-semibold text-grad sm:block">
        ${(item.price * item.qty).toFixed(2)}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Quitar del carrito"
        className="text-muted transition-colors hover:text-brand-2"
      >
        🗑
      </button>
    </div>
  );
}
