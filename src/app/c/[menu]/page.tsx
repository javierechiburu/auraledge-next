import { notFound } from "next/navigation";
import { getMenus, getProductsByMenu } from "@/lib/api/strapi";
import MenuExplorer from "@/components/beats/MenuExplorer";
import Footer from "@/components/global/Footer";

export async function generateStaticParams() {
  const menus = await getMenus();
  return menus.map((m) => ({ menu: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ menu: string }>;
}) {
  const { menu: slug } = await params;
  const menus = await getMenus();
  const menu = menus.find((m) => m.slug === slug);
  return {
    title: menu ? `${menu.name} | Genio Music` : "Catálogo | Genio Music",
  };
}

export default async function MenuPage({
  params,
}: {
  params: Promise<{ menu: string }>;
}) {
  const { menu: slug } = await params;
  const [menus, products] = await Promise.all([getMenus(), getProductsByMenu(slug)]);
  const menu = menus.find((m) => m.slug === slug);
  if (!menu) notFound();

  return (
    <main className="bg-bg pt-32">
      <div className="mx-auto max-w-7xl px-6 pb-10">
        <h1 className="font-orbitron text-[clamp(26px,3.4vw,40px)] font-extrabold leading-[0.9] tracking-tighter text-ink">
          {menu.name}
        </h1>
        <p className="mt-2 max-w-xl text-[15px] text-muted">
          Explora la colección de {menu.name.toLowerCase()}. Filtra por subcategoría,
          precio y promoción.
        </p>
      </div>
      <MenuExplorer products={products} subcategories={menu.subcategories} />
      <Footer />
    </main>
  );
}
