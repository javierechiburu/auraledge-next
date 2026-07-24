import { getProducts, getTestimonials } from "@/lib/strapi";
import Hero from "@/components/Hero";
import BestValue from "@/components/BestValue";
import Highlight from "@/components/Highlight";
import Collection from "@/components/Collection";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default async function Home() {
  const [products, testimonials] = await Promise.all([
    getProducts(),
    getTestimonials(),
  ]);

  const heroProduct = products.find((p) => p.highlight) ?? products[0];
  const bestValueProduct = products.find((p) => p.bestValue) ?? products[0];

  return (
    <main>
      <Hero product={heroProduct} />
      <BestValue product={bestValueProduct} />
      <Collection products={products} />
      <CTA />
      <Footer />
    </main>
  );
}
