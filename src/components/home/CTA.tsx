import Image from "next/image";
import ScrollReveal from "../shared/ScrollReveal";

export default function CTA() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-24">
      <div className="relative overflow-visible">
        <div className="relative overflow-visible rounded-[32px] bg-[linear-gradient(to_left,#000_0%,#7a0d00_75%,#c81a00_100%)] shadow-[0_25px_80px_rgba(0,0,0,.45)]">
          <div className="grid min-h-[430px] items-center lg:grid-cols-[1.1fr_1fr]">
            {/* Texto */}
            <div className="relative z-20 px-10 py-14 lg:px-16">
              <h2 className="mb-5 text-[clamp(34px,4vw,56px)] font-extrabold leading-tight">
                Encuentra Tu
                <br />
                Próximo Hit.
              </h2>

              <p className="mb-8 max-w-md text-white/80 leading-7">
                Explora una colección de pistas y beats originales para
                productores, artistas y creadores que buscan un sonido único.
              </p>

              <a
                href="#collection"
                className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:scale-105"
              >
                Explorar colección
                <span>→</span>
              </a>
            </div>

            <div />
          </div>

          {/* Imagen que sobresale */}
          <ScrollReveal
            direction="down"
            distance={-200}
            duration={1.5}
            className="
              absolute
              -right-38
              -bottom-80
              hidden
              lg:block
              w-[920px]
              h-[1020px]
            "
          >
            <div className="relative w-full h-full">
              {/* Sombra con la misma silueta */}
              <Image
                src="/assets/logo-bg.png"
                alt=""
                fill
                aria-hidden
                className="
                  object-contain
                  brightness-0
                  opacity-100
                  scale-105
                  translate-x-5
                  translate-y-5
                  z-0
                "
              />

              {/* Imagen principal */}
              <Image
                src="/assets/logo-bg.png"
                alt="GENIOMUSIC"
                fill
                priority
                className="
                  object-contain
                  relative
                  z-10
                "
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
