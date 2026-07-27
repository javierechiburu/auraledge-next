import { CartItem } from "@/lib/types";
import CartLineItem from "./CartLineItem";

export default function CartSummary({
  items,
  total,
  onQtyChange,
  onRemove,
}: {
  items: CartItem[];
  total: number;
  onQtyChange: (slug: string, qty: number) => void;
  onRemove: (slug: string) => void;
}) {
  return (
    <div className="space-y-6 border border-line bg-card p-8">
      <h2 className="text-lg font-semibold text-ink">Tu carrito</h2>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <CartLineItem
            key={item.slug}
            item={item}
            onQtyChange={(qty) => onQtyChange(item.slug, qty)}
            onRemove={() => onRemove(item.slug)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-line pt-6 text-lg font-semibold text-ink">
        <span>Total</span>
        <span className="tabular-nums">${Math.round(total).toLocaleString("es-CL")}</span>
      </div>
    </div>
  );
}
