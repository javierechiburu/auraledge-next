import { getProducts } from "@/lib/strapi";
import Hero from "@/components/Hero";
import BestValue from "@/components/BestValue";
import Collection from "@/components/Collection";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default async function Home() {
  const products = await getProducts();
  const bestValueProduct = products.find((p) => p.bestValue) ?? products[0];

  return (
    <main>
      <Hero />
      <ScrollReveal direction="right">
        <BestValue product={bestValueProduct} />
      </ScrollReveal>
      <ScrollReveal direction="up">
        <Collection products={products} />
      </ScrollReveal>
      <CTA />
      <Footer />
    </main>
  );
}
