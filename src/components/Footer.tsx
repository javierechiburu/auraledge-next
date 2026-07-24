const SITE_LINKS = [
  { label: "Inicio", href: "#top" },
  { label: "Colección", href: "#collection" },
  { label: "Último Beat", href: "#feature" },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M16.5 3c.4 2.2 1.9 3.7 4.1 3.9v3.1c-1.5.1-2.9-.4-4.1-1.2v6.6c0 3.4-2.7 6.1-6.1 6.1S4.3 18.8 4.3 15.4c0-3.4 2.7-6.1 6.1-6.1.4 0 .8 0 1.1.1v3.2a3 3 0 1 0 2.1 2.9V3h2.9z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M4 4l7.2 9.6L4.4 20H7l5.6-5.9L17 20h4l-7.6-10.1L20 4h-2.6l-5.1 5.5L8 4H4z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-[linear-gradient(180deg,transparent,rgba(20,10,5,.8))]">
      <div className="scroll-reveal mx-auto grid max-w-7xl gap-10 px-6 pb-10 pt-15 sm:grid-cols-3">
        <div>
          <a
            href="#top"
            className="flex items-center gap-2 text-[19px] font-extrabold tracking-wide"
          >
            <span className="text-xl text-brand">◎</span> GENIOMUSIC
          </a>
          <p className="mt-3.5 max-w-75 text-[13.5px] leading-[1.6] text-muted">
            Vive el sonido sin límites. Pistas y beats originales, creados
            para inspirar tu próxima producción.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-[15px] font-semibold">Sitio</h4>
          {SITE_LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="mb-2.5 block text-[13.5px] text-muted transition-colors hover:text-brand"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div>
          <h4 className="mb-4 text-[15px] font-semibold">Síguenos</h4>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-line text-muted transition-colors hover:border-brand hover:text-brand"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2.5 border-t border-line px-6 py-5 text-[12.5px] text-muted">
        <span>© 2026 Genio Music. Todos los derechos reservados.</span>
      </div>
    </footer>
  );
}
