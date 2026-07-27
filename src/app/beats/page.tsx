import { getProducts } from "@/lib/api/strapi";
import BeatsExplorer from "@/components/beats/BeatsExplorer";
import Footer from "@/components/global/Footer";

export const metadata = {
  title: "Beats | Genio Music",
  description: "Explora y filtra toda la colección de beats de Genio Music.",
};

export default async function BeatsPage() {
  const products = await getProducts();

  return (
    <main className="pt-32 bg-bg">
      <div className="mx-auto max-w-[1280px] px-6 pb-10">
        <h1 className="text-[clamp(26px,3.4vw,40px)] font-orbitron font-extrabold leading-[0.9] tracking-tighter text-ink">
          Beats
        </h1>
        <p className="mt-2 max-w-xl text-[15px] text-muted">
          Explora la colección. Filtra por precio, categoría y promoción para
          encontrar tu próximo hit.
        </p>
      </div>
      <BeatsExplorer products={products} />
      <Footer />
    </main>
  );
}
