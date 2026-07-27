import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/global/Footer";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-bg">
      <div className="mx-auto max-w-[820px] px-6 pb-20 pt-32">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} /> Volver al inicio
        </Link>

        <h1 className="font-orbitron text-[clamp(28px,4vw,44px)] font-extrabold uppercase tracking-tight text-ink">
          {title}
        </h1>
        {updated && (
          <p className="mt-2 text-sm text-muted">Última actualización: {updated}</p>
        )}

        <div className="legal mt-10 space-y-8">{children}</div>
      </div>
      <Footer />
    </main>
  );
}
