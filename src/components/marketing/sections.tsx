import Link from "next/link";
import {
  ArrowRight,
  Check,
  Palette,
  ScanLine,
  Send,
  Brush,
  Camera,
  ShieldCheck,
  Sparkles,
  Frame,
} from "lucide-react";
import type { Dictionary } from "@/i18n/dictionaries";
import { LotusMark } from "@/components/brand/logo";
import { ArtCollage } from "@/components/ui/hero-04-utils/art-collage";
import { buttonClasses } from "@/components/ui/button";
import { PAINTINGS, metImage } from "@/data/paintings";
import { cn } from "@/lib/utils";

/* ----------------------------------- Hero ---------------------------------- */

export function Hero({ dict }: { dict: Dictionary }) {
  return (
    <section className="grain relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 start-1/3 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-70 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.16), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 end-0 h-[30rem] w-[30rem] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.14), transparent 70%)" }}
      />

      <div className="container-page relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="flex flex-col items-start">
          <p className="eyebrow inline-flex items-center gap-2">
            <LotusMark tone="brand" className="h-4 w-4" />
            {dict.hero.eyebrow}
          </p>

          <h1 className="mt-5 text-balance text-4xl leading-[1.05] md:text-6xl">
            {dict.hero.titleLead}{" "}
            <span className="italic text-primary">{dict.hero.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            {dict.hero.subtitle}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/discover" className={buttonClasses("primary", "lg")}>
              {dict.hero.ctaPrimary}
              <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
            <a href="#how" className={buttonClasses("secondary", "lg")}>
              {dict.hero.ctaSecondary}
            </a>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">{dict.hero.note}</p>
        </div>

        <div className="relative">
          <ArtCollage
            primaryImage={metImage(PAINTINGS[0].file)}
            secondaryImage={metImage(PAINTINGS[1].file)}
            primaryAlt={`${PAINTINGS[0].title} by ${PAINTINGS[0].artist}`}
            secondaryAlt={`${PAINTINGS[1].title} by ${PAINTINGS[1].artist}`}
          />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Marquee --------------------------------- */

export function Marquee({ dict }: { dict: Dictionary }) {
  return (
    <div className="border-y border-border bg-surface/40">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4 text-center">
        {dict.marquee.map((m, i) => (
          <span key={m} className="inline-flex items-center gap-6 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {i > 0 && <span className="text-gold">◆</span>}
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- How it works ------------------------------ */

const howIcons = [Palette, ScanLine, Send, Brush];

export function HowItWorks({ dict }: { dict: Dictionary }) {
  return (
    <section id="how" className="container-page scroll-mt-24 py-24 md:py-32">
      <SectionHeading eyebrow={dict.how.eyebrow} title={dict.how.title} />
      <ol className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {dict.how.steps.map((step, i) => {
          const Icon = howIcons[i % howIcons.length];
          return (
            <li key={step.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={20} />
                </span>
                <span className="font-serif text-3xl text-gold/70">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-5 text-xl">{step.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* -------------------------------- Featured --------------------------------- */

export function Featured({ dict }: { dict: Dictionary }) {
  const grid = PAINTINGS.slice(0, 8);
  return (
    <section id="gallery" className="scroll-mt-24 bg-surface/50 py-24 md:py-32">
      <div className="container-page">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow">{dict.featured.eyebrow}</p>
            <h2 className="mt-4 text-balance text-4xl leading-tight md:text-5xl">{dict.featured.title}</h2>
            <p className="mt-4 text-pretty text-muted-foreground">{dict.featured.subtitle}</p>
          </div>
          <Link href="/gallery" className={cn(buttonClasses("secondary", "md"), "shrink-0")}>
            {dict.featured.cta}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {grid.map((p) => (
            <figure
              key={p.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <img
                src={metImage(p.file)}
                alt={`${p.title} by ${p.artist}`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p className="truncate text-sm font-medium text-white">{p.title}</p>
                <p className="truncate text-xs text-white/70">
                  {dict.common.by} {p.artist}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link href="/discover" className="link-underline text-sm font-medium text-primary">
            {dict.featured.viewAll} →
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Wall preview ------------------------------- */

export function WallPreview({ dict }: { dict: Dictionary }) {
  const p = PAINTINGS[7]; // a calm landscape
  return (
    <section className="container-page py-24 md:py-32">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow inline-flex items-center gap-2">
            <Camera size={14} /> {dict.wall.eyebrow}
          </p>
          <h2 className="mt-4 text-balance text-4xl leading-tight md:text-5xl">{dict.wall.title}</h2>
          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">{dict.wall.body}</p>
          <ul className="mt-8 space-y-3">
            {dict.wall.points.map((pt) => (
              <li key={pt} className="flex items-start gap-2.5 text-sm">
                <Check size={16} className="mt-0.5 shrink-0 text-primary" />
                <span className="text-muted-foreground">{pt}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 font-serif text-xl italic text-foreground/80">{dict.wall.note}</p>
        </div>

        {/* Wall mock: framed painting on a soft plaster wall with AR corner marks */}
        <div className="relative">
          <div
            className="relative flex items-center justify-center overflow-hidden rounded-3xl border border-border p-10 shadow-lift sm:p-16"
            style={{
              background:
                "linear-gradient(145deg, hsl(var(--muted)) 0%, hsl(var(--surface)) 55%, hsl(var(--muted)) 100%)",
            }}
          >
            <div className="relative w-3/5 rotate-[-1deg]">
              <div className="overflow-hidden rounded-sm border-[6px] border-background shadow-2xl ring-1 ring-black/10">
                <img
                  src={metImage(p.file)}
                  alt={`${p.title} by ${p.artist}`}
                  loading="lazy"
                  className="aspect-[4/5] w-full object-cover"
                />
              </div>
              {/* soft cast shadow under frame */}
              <div className="mx-auto mt-3 h-3 w-4/5 rounded-[100%] bg-black/20 blur-md" />
            </div>

            {/* AR reticle corners */}
            <ArReticle />
          </div>
        </div>
      </div>
    </section>
  );
}

function ArReticle() {
  const base = "absolute h-6 w-6 border-primary/70";
  return (
    <>
      <span className={cn(base, "start-5 top-5 border-s-2 border-t-2 rounded-ss-md")} />
      <span className={cn(base, "end-5 top-5 border-e-2 border-t-2 rounded-se-md")} />
      <span className={cn(base, "bottom-5 start-5 border-s-2 border-b-2 rounded-es-md")} />
      <span className={cn(base, "bottom-5 end-5 border-e-2 border-b-2 rounded-ee-md")} />
    </>
  );
}

/* --------------------------------- Sizes ----------------------------------- */

export function Sizes({ dict }: { dict: Dictionary }) {
  return (
    <section id="sizes" className="scroll-mt-24 bg-surface/50 py-24 md:py-32">
      <div className="container-page">
        <SectionHeading eyebrow={dict.sizes.eyebrow} title={dict.sizes.title} subtitle={dict.sizes.subtitle} />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dict.sizes.tiers.map((t, i) => (
            <div
              key={t.name}
              className={cn(
                "flex flex-col rounded-2xl border p-6 transition-all duration-300",
                i === 2 ? "border-primary/40 bg-background shadow-lift" : "border-border bg-background/60 hover:border-gold/40"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <Frame size={18} className="text-muted-foreground" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.dims}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-xs text-muted-foreground">{dict.sizes.from}</span>
                <span className="font-serif text-3xl">{t.price}</span>
              </p>
              <p className="text-xs text-muted-foreground">{dict.sizes.perPiece}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start gap-4 rounded-2xl border border-border bg-background/60 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">{dict.sizes.frameLabel}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {dict.sizes.frames.map((f) => (
                <span key={f} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                  {f}
                </span>
              ))}
            </div>
          </div>
          <p className="max-w-xs text-xs text-muted-foreground">{dict.sizes.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- Values ---------------------------------- */

const valueIcons = [Sparkles, Brush, Camera, ShieldCheck];

export function Values({ dict }: { dict: Dictionary }) {
  return (
    <section className="container-page py-24 md:py-32">
      <SectionHeading eyebrow={dict.values.eyebrow} title={dict.values.title} />
      <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
        {dict.values.items.map((item, i) => {
          const Icon = valueIcons[i % valueIcons.length];
          return (
            <div key={item.title} className="bg-surface p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={20} />
              </div>
              <h3 className="mt-5 text-xl">{item.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ----------------------------------- FAQ ----------------------------------- */

export function Faq({ dict }: { dict: Dictionary }) {
  return (
    <section className="bg-surface/50 py-24 md:py-32">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow={dict.faq.eyebrow} title={dict.faq.title} />
        <div className="mt-12 divide-y divide-border border-y border-border">
          {dict.faq.items.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                {item.q}
                <span className="text-gold transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Final CTA -------------------------------- */

export function FinalCTA({ dict }: { dict: Dictionary }) {
  return (
    <section id="cta" className="container-page py-24 md:py-28">
      <div className="grain relative overflow-hidden rounded-3xl border border-border bg-primary px-8 py-20 text-center text-primary-foreground">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(circle at 50% 0%, hsl(var(--gold) / 0.5), transparent 60%)" }}
        />
        <LotusMark className="relative mx-auto mb-6 h-12 w-12 text-primary-foreground" />
        <h2 className="relative mx-auto max-w-2xl text-4xl md:text-5xl">{dict.cta.title}</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-primary-foreground/80">{dict.cta.subtitle}</p>
        <Link
          href="/discover"
          className={cn(buttonClasses("secondary", "lg"), "relative mt-9 bg-background text-foreground hover:bg-background")}
        >
          {dict.cta.button}
          <ArrowRight size={18} className="rtl:rotate-180" />
        </Link>
        <p className="relative mt-4 text-xs text-primary-foreground/70">{dict.cta.note}</p>
      </div>
    </section>
  );
}

/* ------------------------------- Shared bits ------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-balance text-4xl leading-tight md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-pretty text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
