"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, RefreshCw, Check,
  Square, Landmark, Flame, Wind, Palette,
  Sun, CloudSun, Moon,
  Brush, Shapes, Flower2, Mountain, Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { imageOf } from "@/data/paintings";
import { styleLabel } from "@/lib/style-labels";
import {
  matchPaintings,
  FURNITURE_OPTIONS, HOME_OPTIONS, LIGHT_OPTIONS, LOOK_OPTIONS,
  type MatchAnswers, type FurnitureColor, type HomeStyle, type Light, type Look,
} from "@/lib/home-match";
import { cn } from "@/lib/utils";

// Two-tone swatches that stand in for each furniture palette.
const SWATCH: Record<FurnitureColor, [string, string]> = {
  "warm-wood": ["#c69664", "#ecdcc6"],
  "cool-grey": ["#8b98a7", "#d3dbe3"],
  "bright-white": ["#f6f5f1", "#d8d8d1"],
  "bold-colour": ["#c7443b", "#e6a93f"],
  "dark-moody": ["#2c2831", "#5c4b54"],
};

const HOME_ICON: Record<HomeStyle, LucideIcon> = {
  "modern-minimal": Square,
  "classic-traditional": Landmark,
  "cosy-rustic": Flame,
  "airy-scandi": Wind,
  "eclectic-artistic": Palette,
};
const LIGHT_ICON: Record<Light, LucideIcon> = { bright: Sun, soft: CloudSun, dim: Moon };
const LOOK_ICON: Record<Look, LucideIcon> = {
  impressionist: Brush,
  classic: Landmark,
  modern: Shapes,
  floral: Flower2,
  landscape: Mountain,
  any: Sparkles,
};

type StepKey = "furniture" | "home" | "light" | "look";

export function MatchClient() {
  const { dict, locale } = useI18n();
  const m = dict.match;

  const [answers, setAnswers] = useState<MatchAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);

  const steps = useMemo(
    () => [
      {
        key: "furniture" as StepKey,
        q: m.questions.furniture,
        options: FURNITURE_OPTIONS.map((v) => ({ value: v, label: m.furniture[v], swatch: SWATCH[v] })),
      },
      {
        key: "home" as StepKey,
        q: m.questions.home,
        options: HOME_OPTIONS.map((v) => ({ value: v, label: m.home[v], Icon: HOME_ICON[v] })),
      },
      {
        key: "light" as StepKey,
        q: m.questions.light,
        options: LIGHT_OPTIONS.map((v) => ({ value: v, label: m.light[v], Icon: LIGHT_ICON[v] })),
      },
      {
        key: "look" as StepKey,
        q: m.questions.look,
        options: LOOK_OPTIONS.map((v) => ({ value: v, label: m.look[v], Icon: LOOK_ICON[v] })),
      },
    ],
    [m]
  );

  const atResults = stepIndex >= steps.length;
  // Cap at the strongest 60 matches (best first) — enough to browse, without
  // diluting into the weakly-relevant tail that a single-tone match would add.
  const results = useMemo(() => (atResults ? matchPaintings(answers, 60) : []), [atResults, answers]);

  function choose(key: StepKey, value: string) {
    setAnswers((a) => ({ ...a, [key]: value }) as MatchAnswers);
    setStepIndex((i) => i + 1);
  }
  function skip(key: StepKey) {
    setAnswers((a) => ({ ...a, [key]: null }) as MatchAnswers);
    setStepIndex((i) => i + 1);
  }
  function restart() {
    setAnswers({});
    setStepIndex(0);
  }

  if (atResults) {
    return (
      <Results
        key={JSON.stringify(answers)}
        results={results}
        answers={answers}
        m={m}
        locale={locale}
        tones={dict.discover.tones}
        by={dict.common.by}
        onAdjust={() => setStepIndex(0)}
        onRestart={restart}
      />
    );
  }

  const step = steps[stepIndex];
  const selected = answers[step.key];
  const progress = (stepIndex / steps.length) * 100;

  return (
    <div className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center">
          <p className="eyebrow">{m.eyebrow}</p>
          <h1 className="mt-4 text-balance text-4xl leading-tight md:text-5xl">{m.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">{m.subtitle}</p>
        </div>

        {/* Progress */}
        <div className="mx-auto mt-12 max-w-xl">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>{m.step} {stepIndex + 1} {m.of} {steps.length}</span>
            <span>{Math.round(((stepIndex + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max(progress, 6)}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div key={stepIndex} className="mt-10 motion-safe:animate-in motion-safe:fade-in-50">
          <h2 className="text-center font-serif text-2xl md:text-3xl">{step.q}</h2>

          <div
            className={cn(
              "mt-8 grid gap-3",
              step.key === "furniture" ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {step.options.map((opt) => {
              const isOn = selected === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => choose(step.key, opt.value)}
                  className={cn(
                    "group relative flex items-center gap-4 rounded-2xl border bg-surface p-4 text-start transition-all cursor-pointer hover:-translate-y-0.5 hover:shadow-soft",
                    isOn ? "border-primary ring-2 ring-ring/30" : "border-border hover:border-primary/50"
                  )}
                >
                  {"swatch" in opt && opt.swatch ? (
                    <span
                      aria-hidden
                      className="h-11 w-11 shrink-0 rounded-xl border border-border/60"
                      style={{ background: `linear-gradient(135deg, ${opt.swatch[0]} 50%, ${opt.swatch[1]} 50%)` }}
                    />
                  ) : "Icon" in opt && opt.Icon ? (
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                      <opt.Icon size={20} />
                    </span>
                  ) : null}
                  <span className="text-sm font-medium">{opt.label}</span>
                  {isOn && (
                    <span className="absolute end-3 top-3 text-primary">
                      <Check size={16} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" /> {m.back}
          </button>
          <button
            type="button"
            onClick={() => skip(step.key)}
            className="inline-flex items-center gap-1.5 text-sm text-primary link-underline cursor-pointer"
          >
            {m.skip} <ArrowRight size={16} className="rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Results({
  results,
  answers,
  m,
  locale,
  tones,
  by,
  onAdjust,
  onRestart,
}: {
  results: ReturnType<typeof matchPaintings>;
  answers: MatchAnswers;
  m: ReturnType<typeof useI18n>["dict"]["match"];
  locale: ReturnType<typeof useI18n>["locale"];
  tones: ReturnType<typeof useI18n>["dict"]["discover"]["tones"];
  by: string;
  onAdjust: () => void;
  onRestart: () => void;
}) {
  const STEP = 24;
  const [visible, setVisible] = useState(STEP);
  const shown = results.slice(0, visible);

  // Chips summarising what the visitor picked.
  const picks = [
    answers.furniture && m.furniture[answers.furniture],
    answers.home && m.home[answers.home],
    answers.light && m.light[answers.light],
    answers.look && answers.look !== "any" && m.look[answers.look],
  ].filter(Boolean) as string[];

  return (
    <div className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{m.eyebrow}</p>
        <h1 className="mt-4 text-balance text-4xl leading-tight md:text-5xl">{m.results.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">{m.results.lead}</p>
        {results.length > 0 && (
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            {results.length} {m.results.count}
          </p>
        )}

        {picks.length > 0 && (
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {picks.map((p) => (
              <span key={p} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
                {p}
              </span>
            ))}
          </div>
        )}

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onAdjust}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:bg-muted cursor-pointer"
          >
            {m.results.adjust}
          </button>
          <button
            type="button"
            onClick={onRestart}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            <RefreshCw size={14} /> {m.results.restart}
          </button>
        </div>
      </div>

      {results.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">{m.results.none}</p>
      ) : (
        <>
        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {shown.map(({ painting: p }) => (
            <Link
              key={p.id}
              href={`/art/${p.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageOf(p)}
                alt={`${p.title} — ${p.artist}`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="p-3">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="truncate text-xs text-muted-foreground">{by} {p.artist}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{tones[p.tone]}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{styleLabel(p.style, locale)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {visible < results.length && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setVisible((v) => v + STEP)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-muted cursor-pointer"
            >
              {m.results.showMore}
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
