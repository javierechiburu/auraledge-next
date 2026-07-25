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
    <main className="pt-32 bg-black">
      <div className="mx-auto max-w-[1280px] px-6 pb-10">
        <h2 className="font-display text-[clamp(28px,4vw,44px)] normal-case">
          Explora todos los <span className="text-grad">Beats</span>
        </h2>
        <p className="mt-2 max-w-xl text-[15px] text-muted">
          Filtra por precio, categoría y promoción para encontrar tu próximo
          hit.
        </p>
      </div>
      <BeatsExplorer products={products} />
      <Footer />
    </main>
  );
}
