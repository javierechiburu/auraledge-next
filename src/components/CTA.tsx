export default function CTA() {
  return (
    <section className="mx-auto max-w-[1280px] px-6 pb-20 pt-10">
      <div className="grid overflow-hidden rounded-[28px] bg-grad-red shadow-glow lg:grid-cols-[1.1fr_1fr]">
        <div className="p-[46px] lg:px-[46px] lg:py-[54px]">
          <h2 className="mb-4 text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.1]">
            Hear Every Detail.
            <br />
            Feel Every Beat.
          </h2>
          <p className="mb-[26px] max-w-[400px] text-[15px] text-[rgba(255,240,230,.85)]">
            Step into a new dimension of sound — where clarity meets emotion, and innovation meets
            design.
          </p>
          <a href="#collection" className="btn btn-dark">
            Explore Collection <span className="btn-ic">↗</span>
          </a>
        </div>
        <div className="min-h-[220px] bg-[radial-gradient(140px_140px_at_55%_45%,rgba(255,210,90,.7),transparent_60%),rgba(0,0,0,.35)] lg:min-h-[300px]" />
      </div>
    </section>
  );
}
