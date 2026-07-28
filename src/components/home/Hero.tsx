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
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5 md:px-10">
          {/* Rating */}
          <div className="flex items-center gap-3">
            <span className="text-[clamp(22px,4vw,32px)] font-extrabold leading-none">
              5.0
            </span>
            <div>
              <div className="text-sm tracking-[2px] text-amber">★★★★★</div>
              <div className="mt-1 flex items-center">
                <span className="h-6 w-6 rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 h-6 w-6 rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 h-6 w-6 rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 grid h-6 w-6 place-items-center rounded-full border-2 border-bg bg-grad text-[10px] font-bold text-[#1a0a00]">
                  +
                </span>
              </div>
            </div>
          </div>

          {/* Clientes */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="h-6 w-6 rounded-full border-2 border-bg bg-grad" />
              <span className="-ml-2 h-6 w-6 rounded-full border-2 border-bg bg-grad" />
              <span className="-ml-2 h-6 w-6 rounded-full border-2 border-bg bg-grad" />
            </div>
            <strong className="text-[clamp(15px,2.5vw,18px)] leading-none">
              30K+
            </strong>
          </div>
        </div>

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
