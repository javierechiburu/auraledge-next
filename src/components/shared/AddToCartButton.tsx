"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/types";

export default function AddToCartButton({
  product,
  label = "Buy Now",
  className = "btn btn-primary btn-xs",
  children,
  ariaLabel,
}: {
  product: Product;
  label?: string;
  className?: string;
  /** Si se pasa contenido (p. ej. un ícono), se renderiza en vez del label. */
  children?: React.ReactNode;
  ariaLabel?: string;
}) {
  const { addItem } = useCart();
  return (
    <button
      className={className}
      aria-label={ariaLabel ?? (children ? "Agregar al carrito" : undefined)}
      onClick={() =>
        addItem({
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image?.url ?? null,
        })
      }
    >
      {children ?? label}
    </button>
  );
}
