"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem } from "@/lib/types";

function clp(n: number) {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

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
    <div className="flex items-center gap-4 border-b border-line py-4 last:border-b-0">
      <div
        className="h-16 w-16 flex-shrink-0 bg-panel bg-cover bg-center grayscale"
        style={item.image ? { backgroundImage: `url(${item.image})` } : undefined}
      />
      <div className="min-w-0 flex-1">
        <strong className="block truncate text-[15px] text-ink">{item.name}</strong>
        <span className="text-sm tabular-nums text-muted">{clp(item.price)}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onQtyChange(item.qty - 1)}
          aria-label="Quitar uno"
          className="grid h-8 w-8 place-items-center border border-line text-accent transition-colors hover:bg-white/5"
        >
          <Minus size={15} />
        </button>
        <span className="w-6 text-center tabular-nums text-ink">{item.qty}</span>
        <button
          type="button"
          onClick={() => onQtyChange(item.qty + 1)}
          aria-label="Agregar uno"
          className="grid h-8 w-8 place-items-center border border-line text-accent transition-colors hover:bg-white/5"
        >
          <Plus size={15} />
        </button>
      </div>
      <span className="hidden w-20 text-right text-sm font-semibold tabular-nums text-ink sm:block">
        {clp(item.price * item.qty)}
      </span>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Quitar del carrito"
        className="text-muted transition-colors hover:text-red-400"
      >
        <Trash2 size={17} />
      </button>
    </div>
  );
}
