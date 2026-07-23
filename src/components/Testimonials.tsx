import Image from "next/image";
import { Testimonial } from "@/lib/types";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  return (
    <section id="testimonials" className="mx-auto max-w-[1280px] scroll-mt-24 px-6 py-[70px]">
      <div className="mx-auto mb-11 max-w-[640px] text-center">
        <h2 className="mb-3.5 text-[clamp(28px,4vw,44px)] font-extrabold">
          Loved by <span className="text-grad">Thousands</span>
        </h2>
        <p className="text-[15px] text-muted">
          Hear what real users are saying about AuralEdge — where pure sound meets design, trusted by
          music lovers, creators, and professionals.
        </p>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
        {items.map((t) => (
          <article key={t.id} className="rounded-[22px] border border-line surface-soft p-[26px]">
            <div className="mb-3.5 text-sm tracking-[2px] text-amber">
              {"★".repeat(Math.round(t.rating || 5))}
            </div>
            <p className="mb-5 text-sm leading-[1.6]">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 overflow-hidden rounded-full bg-grad">
                {t.avatar?.url && (
                  <Image
                    src={t.avatar.url}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <strong className="block text-sm">{t.name}</strong>
                <small className="text-xs text-muted">{t.role}</small>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a href="#testimonials" className="btn btn-outline">
          Read More Reviews
        </a>
      </div>
    </section>
  );
}
