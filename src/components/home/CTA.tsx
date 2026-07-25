import Image from "next/image";

export default function CTA() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-20 pt-10">
      <div className="scroll-reveal grid overflow-hidden rounded-[28px] bg-[linear-gradient(to_left,#000_0%,#7a0d00_75%,#c81a00_100%)] shadow-glow lg:grid-cols-[1.1fr_1fr]">
        <div className="p-[46px] lg:px-[46px] lg:py-[54px]">
          <h2 className="mb-4 text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.1]">
            Encuentra Tu Próximo Hit.
            <br />
            Siente Cada Beat.
          </h2>
          <p className="mb-[26px] max-w-[400px] text-[15px] text-[rgba(255,240,230,.85)]">
            Explora una colección de pistas y beats originales — donde la
            creatividad se encuentra con el ritmo, listos para tu próxima
            producción.
          </p>
          <a href="#collection" className="btn btn-dark">
            Explorar colección <span className="btn-ic">↗</span>
          </a>
        </div>
        <div className="flex min-h-[220px] items-center justify-center bg-[radial-gradient(140px_140px_at_55%_45%,rgba(255,210,90,.7),transparent_60%),rgba(0,0,0,.35)] lg:min-h-[300px]">
          <div className="relative aspect-5/6 w-48 overflow-hidden sm:w-56">
            <Image
              src="/assets/logo-bg.png"
              alt="GENIOMUSIC logo"
              fill
              sizes="224px"
              className="object-cover object-[center_56%] drop-shadow-[0_20px_60px_rgba(0,0,0,.6)]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
