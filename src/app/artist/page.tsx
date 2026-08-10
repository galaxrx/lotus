import Link from "next/link";
import { ArrowRight, Brush, PenTool, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NiloosaMark } from "@/components/brand/logo";
import { buttonClasses } from "@/components/ui/button";
import { getI18n } from "@/i18n/server";
import { metImage } from "@/data/paintings";
import { cn } from "@/lib/utils";

export const metadata = { title: "The artist" };

// Public-domain exemplars (The Met) that illustrate each style, index-aligned
// with dict.artist.styles.
const STYLE_IMAGES = [
  "DP-42549-001", // Van Gogh — Wheat Field with Cypresses (impressionism)
  "DT1926", // Ingres — Madame Leblanc (classical portraiture)
  "DP145929", // Pieter Claesz — Skull & Quill (Dutch still life)
  "DP346474", // Van Gogh — Irises (floral & botanical)
  "DP119115", // Bruegel — The Harvesters (landscape)
  "DP-13139-001", // David — The Death of Socrates (old master figures)
];

export default async function ArtistPage() {
  const { dict } = await getI18n();
  const a = dict.artist;

  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* ---------------------------------- Hero --------------------------------- */}
        <section className="grain relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 start-1/4 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.16), transparent 70%)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-40 end-0 h-[30rem] w-[30rem] rounded-full opacity-60 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.16), transparent 70%)" }}
          />

          <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
            <div className="flex flex-col items-start">
              <p className="eyebrow inline-flex items-center gap-2">
                <NiloosaMark tone="brand" className="h-4 w-4" />
                {a.eyebrow}
              </p>

              <h1 className="mt-5 text-balance text-5xl leading-[1.02] md:text-7xl">{a.name}</h1>

              <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-gold">{a.role}</p>

              <p className="mt-7 max-w-xl font-serif text-2xl italic leading-snug text-foreground/85">
                {a.lead}
              </p>

              <p className="mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">{a.intro}</p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/discover" className={buttonClasses("primary", "lg")}>
                  {a.ctaPrimary}
                  <ArrowRight size={18} className="rtl:rotate-180" />
                </Link>
                <Link href="/gallery" className={buttonClasses("secondary", "lg")}>
                  {a.ctaSecondary}
                </Link>
              </div>
            </div>

            {/* Portrait */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative rotate-[1.2deg]">
                <div className="overflow-hidden rounded-3xl border border-border bg-surface p-2 shadow-lift ring-1 ring-gold/25">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/artist/niloofar.png"
                    alt={a.name}
                    className="aspect-[3/4] w-full rounded-2xl object-cover"
                  />
                </div>
                {/* Signature chip */}
                <div className="absolute -bottom-5 start-6 flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 shadow-soft backdrop-blur">
                  <PenTool size={14} className="text-primary" />
                  <span className="font-serif text-sm italic text-foreground/80">{a.name}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------- Highlights ------------------------------ */}
        <section className="border-y border-border bg-surface/50">
          <div className="container-page grid gap-px overflow-hidden sm:grid-cols-3">
            {a.highlights.map((h) => (
              <div key={h.value} className="flex flex-col items-center gap-1 px-6 py-8 text-center">
                <span className="font-serif text-2xl md:text-3xl">{h.value}</span>
                <span className="text-sm text-muted-foreground">{h.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------- Statement ------------------------------- */}
        <section className="container-page py-24 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow inline-flex items-center gap-2 justify-center">
              <Sparkles size={14} /> {a.statementTitle}
            </p>
            <blockquote className="mt-8 text-balance font-serif text-3xl leading-tight text-foreground md:text-4xl">
              <span className="text-gold">“</span>
              {a.quote}
              <span className="text-gold">”</span>
            </blockquote>
            <p className="mx-auto mt-8 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
              {a.statement}
            </p>
          </div>
        </section>

        {/* --------------------------------- Styles -------------------------------- */}
        <section className="scroll-mt-24 bg-surface/50 py-24 md:py-32">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow inline-flex items-center gap-2 justify-center">
                <Brush size={14} /> {a.stylesTitle}
              </p>
              <h2 className="mt-4 text-balance text-4xl leading-tight md:text-5xl">{a.stylesTitle}</h2>
              <p className="mt-4 text-pretty text-muted-foreground">{a.stylesSubtitle}</p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {a.styles.map((s, i) => (
                <article
                  key={s.name}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={metImage(STYLE_IMAGES[i % STYLE_IMAGES.length])}
                      alt={s.name}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute start-3 top-3 flex h-8 items-center rounded-full border border-white/25 bg-black/45 px-3 font-serif text-xs text-white backdrop-blur">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold leading-snug">{s.name}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ Commission CTA --------------------------- */}
        <section className="container-page py-24 md:py-28">
          <div className="grain relative overflow-hidden rounded-3xl border border-border bg-primary px-8 py-20 text-center text-primary-foreground">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--gold) / 0.5), transparent 60%)" }}
            />
            <NiloosaMark className="relative mx-auto mb-6 h-12 w-12 text-primary-foreground" />
            <h2 className="relative mx-auto max-w-2xl text-4xl md:text-5xl">{a.commissionTitle}</h2>
            <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/80">{a.commissionBody}</p>
            <Link
              href="/discover"
              className={cn(buttonClasses("secondary", "lg"), "relative mt-9 bg-background text-foreground hover:bg-background")}
            >
              {a.commissionButton}
              <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
