import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

/* Íconos de marca (lucide-react de este proyecto no los incluye) */
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[17px] w-[17px]">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[17px] w-[17px]">
    <path d="M16.5 3c.4 2.2 1.9 3.7 4.1 3.9v3.1c-1.5.1-2.9-.4-4.1-1.2v6.6c0 3.4-2.7 6.1-6.1 6.1S4.3 18.8 4.3 15.4c0-3.4 2.7-6.1 6.1-6.1.4 0 .8 0 1.1.1v3.2a3 3 0 1 0 2.1 2.9V3h2.9z" />
  </svg>
);
const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-[17px] w-[17px]">
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
  </svg>
);
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-[17px] w-[17px]">
    <path d="M4 4l7.2 9.6L4.4 20H7l5.6-5.9L17 20h4l-7.6-10.1L20 4h-2.6l-5.1 5.5L8 4H4z" />
  </svg>
);

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Explorar",
    links: [
      { label: "Inicio", href: "/#top" },
      { label: "Beats", href: "/beats" },
      { label: "Último Beat", href: "/#feature" },
    ],
  },
  {
    title: "Cuenta",
    links: [
      { label: "Mi perfil", href: "/perfil" },
      { label: "Mis compras", href: "/perfil" },
      { label: "Checkout", href: "/checkout" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Términos", href: "#" },
      { label: "Privacidad", href: "#" },
      { label: "Licencias", href: "#" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "#", Icon: InstagramIcon },
  { label: "TikTok", href: "#", Icon: TikTokIcon },
  { label: "YouTube", href: "#", Icon: YoutubeIcon },
  { label: "X", href: "#", Icon: XIcon },
];

export default function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-line bg-panel">
      <div className="mx-auto max-w-7xl px-6 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <Link href="/#top" className="inline-flex items-center gap-2 text-lg font-bold tracking-wide text-ink">
              <Image
                src="/assets/logo-bg.png"
                alt="GENIOMUSIC logo"
                width={32}
                height={32}
                className="rounded-full"
              />
              GENIOMUSIC
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Vive el sonido sin límites. Pistas y beats originales, creados para
              inspirar tu próxima producción.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center border border-line text-accent transition-colors hover:bg-accent hover:text-black"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Columnas de enlaces */}
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-1 text-sm text-ink/80 transition-colors hover:text-ink"
                    >
                      {l.label}
                      <ArrowUpRight
                        size={13}
                        className="opacity-0 transition-opacity group-hover:opacity-60"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Wordmark imponente */}
        <div
          aria-hidden
          className="pointer-events-none mt-14 select-none text-center font-clash text-[clamp(64px,18vw,240px)] font-semibold uppercase leading-[0.8] tracking-tight text-white/[0.04]"
        >
          Genio Music
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-5 text-xs text-muted">
          <span>© 2026 Genio Music. Todos los derechos reservados.</span>
          <span>Pagos seguros con Mercado Pago · Hecho en Chile</span>
        </div>
      </div>
    </footer>
  );
}
