const COLS = [
  {
    title: "Product",
    links: [
      { label: "Headphones", href: "#collection" },
      { label: "Earbuds", href: "#collection" },
      { label: "Pro X", href: "#highlight" },
      { label: "Accessories", href: "#feature" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Reviews", href: "#testimonials" },
      { label: "Contact", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-[linear-gradient(180deg,transparent,rgba(20,10,5,.8))]">
      <div className="scroll-reveal mx-auto grid max-w-[1280px] gap-10 px-6 pb-10 pt-[60px] sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
        <div>
          <a
            href="#top"
            className="flex items-center gap-2 text-[19px] font-extrabold tracking-wide"
          >
            <span className="text-xl text-brand">◎</span> GENIOMUSIC
          </a>
          <p className="mt-3.5 max-w-[300px] text-[13.5px] leading-[1.6] text-muted">
            Experience sound without limits. Premium wireless headphones
            engineered for pure, limitless audio.
          </p>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-[15px] font-semibold">{col.title}</h4>
            {col.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="mb-2.5 block text-[13.5px] text-muted transition-colors hover:text-brand"
              >
                {l.label}
              </a>
            ))}
          </div>
        ))}

        <div>
          <h4 className="mb-4 text-[15px] font-semibold">Newsletter</h4>
          <p className="text-[13.5px] leading-[1.6] text-muted">
            Get the latest drops and offers.
          </p>
          <div className="mt-3.5 flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 rounded-[10px] border border-line bg-panel px-3 py-2.5 text-[13px] text-ink outline-none placeholder:text-muted"
            />
            <button className="btn btn-primary btn-xs">Join</button>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1280px] flex-wrap justify-between gap-2.5 border-t border-line px-6 py-5 text-[12.5px] text-muted">
        <span>© 2026 Genio Music. All rights reserved.</span>
        <span>Privacy · Terms · Cookies</span>
      </div>
    </footer>
  );
}
