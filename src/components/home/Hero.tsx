import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[100vh] scroll-mt-24 overflow-hidden bg-[radial-gradient(circle_at_center,#ff7a18_0%,#ff4d10_20%,#c81a00_40%,#7a0d00_55%,#0a0705_100%)]"
    >
      {/* Texto de fondo "Genio Music" con gradiente naranja→amarillo */}
      <h1
        aria-hidden="true"
        className="font-orbitron pointer-events-none absolute inset-x-0 top-[110px] z-[1] select-none text-center text-[clamp(40px,6.5vw,150px)] font-extrabold uppercase leading-[0.9] tracking-tight bg-[linear-gradient(180deg,#7a0d00_0%,#c81a00_40%,#ff4d10_70%,#ff7a18_100%)] bg-clip-text text-transparent"
      >
        Genio Music
      </h1>

      {/* Silueta central — centrada horizontalmente, anclada al borde inferior */}
      <div className="absolute inset-x-0 bottom-[130px] z-[2] flex justify-center lg:bottom-0">
        <div className="neon-wrap relative aspect-757/1120 h-[min(80vh,105vw,700px)] lg:h-[min(85vh,38vw,650px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/siluetav3.png"
            alt="Person wearing headphones with ambient glow"
            className="neon-glow absolute inset-0 h-full w-full object-cover object-center"
          />
          <div aria-hidden="true" className="neon-sweep absolute inset-0" />
          {/* Anillo concéntrico sobre el audífono de la silueta (centro real de la imagen: ~57%, 37%) */}
          <div className=" animate-ring-bounce-glow absolute left-[72%] lg:left-[65%] top-[41%] lg:top-[37%] z-2 h-30 w-30 -translate-x-1/2 -translate-y-1/2 rounded-full border-3 border-amber/80 lg:h-40 lg:w-40" />
        </div>
      </div>

      {/* Cards superpuestas — posicionadas absolutamente sobre la silueta */}
      <div className="absolute inset-x-0 bottom-0 z-[4] mx-auto max-w-[1280px] px-0  md:px-6 pb-6 lg:pb-10">
        {/* Bottom bar: rating + explore + customers */}
        <div className="my-7 flex flex-wrap items-center justify-between gap-4">
          {/* Rating */}
          <div className="flex items-center gap-3">
            <span className="text-[28px] font-extrabold">5.0</span>
            <div>
              <div className="text-sm tracking-[2px] text-amber">★★★★★</div>
              <div className="flex items-center">
                <span className="h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
                <span className="-ml-2 grid h-[24px] w-[24px] place-items-center rounded-full border-2 border-bg bg-grad text-[10px] font-bold text-[#1a0a00]">
                  +
                </span>
              </div>
            </div>
          </div>

          {/* Explore Collection */}
          <Link
            href="/beats"
            className="absolute bottom-0 flex items-center justify-center w-full bg-black py-3 text-sm font-semibold"
          >
            Explorar colección ↗
          </Link>

          {/* Customers */}
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <span className="h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
              <span className="-ml-2 h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
              <span className="-ml-2 h-[24px] w-[24px] rounded-full border-2 border-bg bg-grad" />
            </div>
            <div>
              <strong className="block text-[16px]">30K+</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
