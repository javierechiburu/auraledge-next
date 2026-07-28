import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-svh scroll-mt-24 flex-col overflow-hidden bg-[radial-gradient(circle_at_center,#ff7a18_0%,#ff4d10_20%,#c81a00_40%,#7a0d00_55%,#0a0705_100%)]"
    >
      {/* Texto de fondo "Genio Music" con gradiente naranja→amarillo */}
      <h1
        aria-hidden="true"
        className="font-orbitron pointer-events-none absolute inset-x-0 top-[clamp(72px,14vh,150px)] z-[1] select-none text-center text-[clamp(40px,10vw,150px)] font-extrabold uppercase leading-[0.9] tracking-tighter bg-[linear-gradient(180deg,#7a0d00_0%,#c81a00_40%,#ff4d10_70%,#ff7a18_100%)] bg-clip-text text-transparent"
      >
        Genio Music
      </h1>

      {/* Silueta central — anclada al borde inferior, escala con el viewport
          (limitada por alto y por ancho para no desbordar en ninguna pantalla).
          object-cover recorta los costados grises y `mix-blend-multiply` funde el
          fondo gris de la foto con el gradiente naranja del hero. El neón del
          audífono ya viene horneado en la imagen. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex justify-center">
        <div className="neon-wrap relative aspect-[757/1120] h-[min(82vh,140vw,780px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/siluetav3.png"
            alt="Persona con audífonos y resplandor neón"
            className="neon-glow absolute inset-0 h-full w-full object-cover object-[45%_center] mix-blend-multiply"
          />
        </div>
      </div>

      {/* Barra inferior: rating · clientes · explorar (apilada, sin solaparse) */}
      <div className="absolute inset-x-0 bottom-0 z-[4]">
        {/* Explorar colección — barra negra full-bleed */}
        <Link
          href="/beats"
          className="flex w-full items-center justify-center bg-black py-3 text-sm font-semibold transition-colors hover:text-accent"
        >
          Explorar colección ↗
        </Link>
      </div>
    </section>
  );
}
