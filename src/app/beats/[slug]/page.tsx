import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/api/strapi";
import ProductDetail from "@/components/product/ProductDetail";
import Footer from "@/components/global/Footer";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main>
      <ProductDetail product={product} />
      <Footer />
    </main>
  );
}
