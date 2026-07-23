"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/types";

export default function AddToCartButton({
  product,
  label = "Buy Now",
  className = "btn btn-primary btn-xs",
}: {
  product: Product;
  label?: string;
  className?: string;
}) {
  const { addItem } = useCart();
  return (
    <button
      className={className}
      onClick={() =>
        addItem({
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image?.url ?? null,
        })
      }
    >
      {label}
    </button>
  );
}
