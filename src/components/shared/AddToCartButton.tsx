"use client";

import { useState } from "react";
import { ThumbsUp } from "lucide-react";
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
  // Ids de confirmaciones activas (permite varios clics seguidos).
  const [pings, setPings] = useState<number[]>([]);
  const [popping, setPopping] = useState(false);

  function handleAdd() {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image?.url ?? null,
    });

    const id = Date.now();
    setPings((p) => [...p, id]);
    setPopping(true);
    setTimeout(() => setPings((p) => p.filter((x) => x !== id)), 750);
    setTimeout(() => setPopping(false), 300);
  }

  return (
    <span className="relative inline-flex">
      {/* Capa de posición (centrada arriba del botón). El hijo hace la animación
          de subida — separados para que el transform de la animación no pise el
          centrado. z-20 para quedar SIEMPRE por delante y ser visible. */}
      {pings.map((id) => (
        <span
          key={id}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-1 z-20 flex justify-center"
        >
          <span className="animate-cart-fly flex items-center gap-0.5 rounded-full bg-black/70 px-1.5 py-0.5 text-accent shadow-lg backdrop-blur-sm">
            <ThumbsUp size={13} strokeWidth={2.5} />
          </span>
        </span>
      ))}

      <button
        type="button"
        className={`${className} ${popping ? "animate-cart-pop" : ""}`}
        aria-label={ariaLabel ?? (children ? "Agregar al carrito" : undefined)}
        onClick={handleAdd}
      >
        {children ?? label}
      </button>
    </span>
  );
}
