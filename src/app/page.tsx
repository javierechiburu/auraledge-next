import { getProducts } from "@/lib/api/strapi";
import Hero from "@/components/home/Hero";
import BestValue from "@/components/home/BestValue";
import Collection from "@/components/home/Collection";
import CTA from "@/components/home/CTA";
import Footer from "@/components/global/Footer";
import ScrollReveal from "@/components/shared/ScrollReveal";

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
