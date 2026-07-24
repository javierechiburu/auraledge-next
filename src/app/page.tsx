import { getProducts } from "@/lib/strapi";
import Hero from "@/components/Hero";
import BestValue from "@/components/BestValue";
import Collection from "@/components/Collection";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default async function Home() {
  const products = await getProducts();
  const bestValueProduct = products.find((p) => p.bestValue) ?? products[0];

  return (
    <main>
      <Hero />
      <BestValue product={bestValueProduct} />
      <Collection products={products} />
      <CTA />
      <Footer />
    </main>
  );
}
