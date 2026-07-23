import Image from "next/image";
import { StrapiImage } from "@/lib/types";

/**
 * Muestra la imagen del producto desde Strapi.
 * Si no hay imagen, deja el fondo degradado del contenedor padre (fallback visual).
 */
export default function ProductMedia({
  image,
  className,
  sizes = "(max-width:768px) 100vw, 400px",
}: {
  image?: StrapiImage | null;
  className?: string;
  sizes?: string;
}) {
  if (!image?.url) return null;
  return (
    <Image
      src={image.url}
      alt={image.alternativeText || "AuralEdge product"}
      fill
      sizes={sizes}
      className={className}
      style={{ objectFit: "cover" }}
    />
  );
}
