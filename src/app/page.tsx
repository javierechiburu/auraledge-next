import { getProducts, getTestimonials } from "@/lib/strapi";
import Hero from "@/components/Hero";
import BestValue from "@/components/BestValue";
import Highlight from "@/components/Highlight";
import Collection from "@/components/Collection";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default async function Home() {
  const [products, testimonials] = await Promise.all([getProducts(), getTestimonials()]);

  const heroProduct = products.find((p) => p.highlight) ?? products[0];
  const bestValue = products.filter((p) => p.bestValue);

  return (
    <main>
      <Hero product={heroProduct} />
      <BestValue products={bestValue.length ? bestValue : products} />
      <Highlight product={heroProduct} />
      <Collection products={products} />
      <Testimonials items={testimonials} />
      <CTA />
      <Footer />
    </main>
  );
}
