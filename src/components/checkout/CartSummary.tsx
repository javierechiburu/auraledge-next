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
    <div className="space-y-6 rounded-[28px] border border-line bg-black p-8">
      <h2 className="font-display text-xl normal-case">Tu carrito</h2>

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

      <div className="flex items-center justify-between border-t border-line pt-6 text-xl font-bold">
        <span>Total</span>
        <span className="text-grad">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
