import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Home, Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buttonClasses } from "@/components/ui/button";
import { getI18n } from "@/i18n/server";
import { PAINTINGS, imageOf } from "@/data/paintings";
import { cn } from "@/lib/utils";

// One exemplar painting per style, index-aligned with dict.styles.items.
const STYLE_EXEMPLAR_IDS = [5, 1, 35, 28, 21, 17, 37];

const slug = (i: number) => `style-${i + 1}`;

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  const s = dict.styles;
  return {
    title: s.metaTitle,
    description: s.metaDescription,
    alternates: { canonical: "/styles" },
    openGraph: {
      title: s.metaTitle,
      description: s.metaDescription,
      type: "article",
    },
  };
}

export default async function StylesPage() {
  const { locale, dict } = await getI18n();
  const s = dict.styles;

  const exemplars = STYLE_EXEMPLAR_IDS.map((id) => PAINTINGS.find((p) => p.id === id)!);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: s.metaTitle,
    description: s.metaDescription,
    inLanguage: locale,
    author: { "@type": "Organization", name: "Niloosa" },
    publisher: { "@type": "Organization", name: "Niloosa" },
    about: s.items.map((it) => ({ "@type": "Thing", name: it.name })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Structured data helps this guide surface as a rich result.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main id="main">
        {/* Hero */}
        <section className="grain relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 start-1/3 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.15), transparent 70%)" }}
          />
          <div className="container-page relative py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">{s.eyebrow}</p>
              <h1 className="mt-4 text-balance text-4xl leading-tight md:text-6xl">{s.title}</h1>
              <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {s.intro}
              </p>
            </div>

            {/* In-page contents (internal links) */}
            <nav aria-label={s.title} className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2">
              {s.items.map((it, i) => (
                <a
                  key={it.name}
                  href={`#${slug(i)}`}
                  className="rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-gold/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {it.name}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* Styles */}
        <div className="container-page py-12 md:py-16">
          <div className="mx-auto max-w-5xl space-y-16 md:space-y-24">
            {s.items.map((it, i) => {
              const art = exemplars[i];
              return (
                <article
                  key={it.name}
                  id={slug(i)}
                  className="scroll-mt-24 grid items-center gap-8 md:grid-cols-2 md:gap-14"
                >
                  {/* Image (alternates side on desktop) */}
                  <div className={cn("relative", i % 2 === 1 && "md:order-2")}>
                    <div className="overflow-hidden rounded-2xl border border-border bg-surface p-2 shadow-lift ring-1 ring-gold/15">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageOf(art)}
                        alt={`${it.name} — for example, ${art.title} by ${art.artist}`}
                        loading="lazy"
                        className="aspect-[4/3] w-full rounded-xl object-cover"
                      />
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      {art.title} — {art.artist}
                    </p>
                  </div>

                  {/* Copy */}
                  <div className={cn(i % 2 === 1 && "md:order-1")}>
                    <p className="eyebrow inline-flex items-center gap-2">
                      <Clock size={13} /> {it.era}
                    </p>
                    <h2 className="mt-3 text-balance text-3xl md:text-4xl">{it.name}</h2>
                    <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">{it.history}</p>

                    <dl className="mt-6 space-y-4">
                      <div className="flex gap-3">
                        <dt className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Users size={16} />
                          <span className="sr-only">{s.paintersLabel}</span>
                        </dt>
                        <dd>
                          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            {s.paintersLabel}
                          </span>
                          <span className="text-sm text-foreground/90">{it.painters}</span>
                        </dd>
                      </div>
                      <div className="flex gap-3">
                        <dt className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Home size={16} />
                          <span className="sr-only">{s.homeLabel}</span>
                        </dt>
                        <dd>
                          <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            {s.homeLabel}
                          </span>
                          <span className="text-sm text-foreground/90">{it.home}</span>
                        </dd>
                      </div>
                    </dl>

                    <Link
                      href="/gallery"
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary link-underline"
                    >
                      {s.browse}
                      <ArrowRight size={15} className="rtl:rotate-180" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* CTA */}
          <div className="mx-auto mt-20 max-w-5xl">
            <div className="grain relative overflow-hidden rounded-3xl border border-border bg-primary px-8 py-16 text-center text-primary-foreground">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--gold) / 0.5), transparent 60%)" }}
              />
              <h2 className="relative mx-auto max-w-2xl text-3xl md:text-4xl">{dict.cta.title}</h2>
              <Link
                href="/discover"
                className={cn(buttonClasses("secondary", "lg"), "relative mt-8 bg-background text-foreground hover:bg-background")}
              >
                {s.cta}
                <ArrowRight size={18} className="rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
