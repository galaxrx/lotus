"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/provider";
import { PAINTINGS, imageOf } from "@/data/paintings";
import { CATEGORIES, TONES, filterPaintings } from "@/lib/catalog";
import type { Category, Tone } from "@/data/paintings";
import { cn } from "@/lib/utils";

export function DiscoverClient() {
  const { dict } = useI18n();
  const d = dict.discover;

  const [category, setCategory] = useState<Category | null>(null);
  const [tone, setTone] = useState<Tone | null>(null);

  const results = useMemo(() => filterPaintings({ category, tone }), [category, tone]);

  const hasFilters = category || tone;

  function href(id: number) {
    return `/art/${id}`;
  }

  return (
    <div className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{dict.nav.browse}</p>
        <h1 className="mt-4 text-balance text-4xl leading-tight md:text-5xl">{d.title}</h1>
        <p className="mt-4 text-pretty text-muted-foreground">{d.subtitle}</p>
      </div>

      {/* Filters */}
      <div className="mx-auto mt-12 max-w-4xl space-y-5">
        <FilterRow label={d.theme}>
          <Chip active={!category} onClick={() => setCategory(null)}>
            {d.any}
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {d.categories[c]}
            </Chip>
          ))}
        </FilterRow>

        <FilterRow label={d.color}>
          <Chip active={!tone} onClick={() => setTone(null)}>
            {d.any}
          </Chip>
          {TONES.map((tn) => (
            <Chip key={tn} active={tone === tn} onClick={() => setTone(tn)}>
              {d.tones[tn]}
            </Chip>
          ))}
        </FilterRow>

        <div className="flex items-center justify-between pt-1">
          <p className="text-sm text-muted-foreground">
            {results.length} {d.results}
          </p>
          {hasFilters && (
            <button
              onClick={() => {
                setCategory(null);
                setTone(null);
              }}
              className="text-sm text-primary link-underline cursor-pointer"
            >
              {d.clear}
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <p className="mt-16 text-center text-muted-foreground">{d.none}</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <Link
              key={p.id}
              href={href(p.id)}
              className="group overflow-hidden rounded-xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
            >
              <img
                src={imageOf(p)}
                alt={`${p.title} by ${p.artist}`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
              <div className="p-3">
                <p className="truncate text-sm font-medium">{p.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {dict.common.by} {p.artist}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Unused import guard for full catalog size reference */}
      <span className="sr-only">{PAINTINGS.length}</span>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="w-28 shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-1.5 text-sm transition-colors cursor-pointer",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
