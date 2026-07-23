import { Product } from "@/lib/types";
import ProductMedia from "./ProductMedia";

export default function Highlight({ product }: { product: Product }) {
  return (
    <section
      id="highlight"
      className="mx-auto grid max-w-[1280px] scroll-mt-24 items-center gap-[50px] px-6 py-[70px] lg:grid-cols-2"
    >
      <div>
        <span className="mb-[18px] inline-block rounded-full bg-grad px-3.5 py-1.5 text-xs font-semibold text-[#1a0a00]">
          Highlight Product
        </span>
        <h2 className="mb-[18px] text-[clamp(30px,4vw,48px)] font-extrabold leading-[1.1]">
          Hear Every Detail.
          <br />
          Feel Every Beat.
        </h2>
        <p className="mb-[26px] max-w-[480px] text-[15px] text-muted">
          Step into a new dimension of sound — where clarity meets emotion, and innovation meets
          design. Whether you&apos;re an artist, traveler, or dreamer, our headphones bring your
          world to life through pure, limitless audio.
        </p>
        <a href="#collection" className="btn btn-primary">
          Explore Collection <span className="btn-ic">↗</span>
        </a>
      </div>
      <div className="relative h-[400px] overflow-hidden rounded-[22px] product-fill shadow-glow after:absolute after:inset-0 after:bg-[radial-gradient(200px_260px_at_50%_60%,rgba(0,0,0,.75),transparent_70%)] after:content-['']">
        <ProductMedia image={product.image} sizes="(max-width:960px) 100vw, 600px" />
      </div>
    </section>
  );
}
