import Link from "next/link";
import { ArrowRight, Brush, PenTool, Sparkles, Heart, HandHeart, Globe } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NiloosaMark } from "@/components/brand/logo";
import { buttonClasses } from "@/components/ui/button";
import { getI18n } from "@/i18n/server";
import { metImage } from "@/data/paintings";
import { cn } from "@/lib/utils";

export const metadata = { title: "About us" };

// Public-domain exemplars (The Met) that illustrate each style, index-aligned
// with dict.artist.styles.
const STYLE_IMAGES = [
  "DP-42549-001",
  "DT1926",
  "DP145929",
  "DP346474",
  "DP119115",
  "DP-13139-001",
];

const VALUE_ICONS = [Brush, HandHeart, Globe];

export default async function AboutPage() {
  const { dict } = await getI18n();
  const a = dict.artist;
  const ab = dict.about;

  return (
    <>
      <SiteHeader />
      <main id="main">
        {/* ---------------------------------- Story hero --------------------------- */}
        <section className="grain relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 start-1/4 h-[34rem] w-[34rem] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.16), transparent 70%)" }}
          />
          <div className="container-page relative py-16 md:py-24">
            <div className="mx-auto max-w-3xl">
              <p className="eyebrow inline-flex items-center gap-2">
                <NiloosaMark tone="brand" className="h-4 w-4" />
                {ab.eyebrow}
              </p>
              <h1 className="mt-5 text-balance text-4xl leading-[1.05] md:text-6xl">{ab.title}</h1>
              <p className="mt-6 max-w-2xl font-serif text-2xl italic leading-snug text-foreground/85">
                {ab.lead}
              </p>
              <div className="mt-8 space-y-5 text-pretty leading-relaxed text-muted-foreground">
                {ab.story.map((p, i) => (
                  <p key={i} className={i === 0 ? "text-lg text-foreground/90" : undefined}>
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------- Values ---------------------------------- */}
        <section className="bg-surface/50">
          <div className="container-page py-16 md:py-20">
            <p className="eyebrow inline-flex items-center gap-2">
              <Heart size={14} /> {ab.valuesTitle}
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {ab.values.map((v, i) => {
                const Icon = VALUE_ICONS[i % VALUE_ICONS.length];
                return (
                  <div key={v.h} className="rounded-2xl border border-border bg-background p-6 shadow-soft">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon size={18} />
                    </span>
                    <h3 className="mt-4 text-lg font-semibold">{v.h}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.b}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------ The founder ------------------------------ */}
        <section className="grain relative overflow-hidden">
          <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
            <div className="flex flex-col items-start">
              <p className="eyebrow inline-flex items-center gap-2">
                <NiloosaMark tone="brand" className="h-4 w-4" />
                {a.eyebrow}
              </p>
              <h2 className="mt-5 text-balance text-4xl leading-[1.02] md:text-6xl">{a.name}</h2>
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-gold">{a.role}</p>
              <p className="mt-7 max-w-xl font-serif text-2xl italic leading-snug text-foreground/85">{a.lead}</p>
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
                <div className="absolute -bottom-5 start-6 flex items-center gap-2 rounded-full border border-border bg-background/95 px-4 py-2 shadow-soft backdrop-blur">
                  <PenTool size={14} className="text-primary" />
                  <span className="font-serif text-sm italic text-foreground/80">{a.name}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------- Statement ------------------------------- */}
        <section className="border-y border-border bg-surface/50">
          <div className="container-page py-20 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow inline-flex items-center gap-2 justify-center">
                <Sparkles size={14} /> {a.statementTitle}
              </p>
              <blockquote className="mt-8 text-balance font-serif text-3xl leading-tight text-foreground md:text-4xl">
                <span className="text-gold">“</span>
                {a.quote}
                <span className="text-gold">”</span>
              </blockquote>
              <p className="mx-auto mt-8 max-w-2xl text-pretty leading-relaxed text-muted-foreground">{a.statement}</p>
            </div>
          </div>
        </section>

        {/* --------------------------------- Styles -------------------------------- */}
        <section className="py-20 md:py-28">
          <div className="container-page">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow inline-flex items-center gap-2 justify-center">
                <Brush size={14} /> {a.stylesTitle}
              </p>
              <h2 className="mt-4 text-balance text-4xl leading-tight md:text-5xl">{a.stylesTitle}</h2>
              <p className="mt-4 text-pretty text-muted-foreground">{a.stylesSubtitle}</p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {a.styles.map((sItem, i) => (
                <article
                  key={sItem.name}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={metImage(STYLE_IMAGES[i % STYLE_IMAGES.length])}
                      alt={sItem.name}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute start-3 top-3 flex h-8 items-center rounded-full border border-white/25 bg-black/45 px-3 font-serif text-xs text-white backdrop-blur">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-lg font-semibold leading-snug">{sItem.name}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{sItem.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------ Commission CTA --------------------------- */}
        <section className="container-page pb-24">
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
