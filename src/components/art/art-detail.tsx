"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Camera, Send } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { Button } from "@/components/ui/button";
import { WallPreview } from "@/components/ar/wall-preview";
import { OrderForm } from "@/components/art/order-form";
import { SIZE_TIERS, FRAMES, formatPrice } from "@/lib/config";
import type { Complexity } from "@/data/paintings";
import { cn } from "@/lib/utils";

export interface ArtDetailData {
  id: number;
  title: string;
  artist: string;
  imageUrl: string;
  category: string;
  complexity: Complexity;
}

export function ArtDetail({
  painting,
  initialSize,
}: {
  painting: ArtDetailData;
  initialSize?: string;
}) {
  const { dict, locale } = useI18n();
  const t = dict.detail;

  const [sizeIdx, setSizeIdx] = useState(() => {
    const i = SIZE_TIERS.findIndex((s) => s.id === initialSize);
    return i >= 0 ? i : 1; // default Medium
  });
  const [frameIdx, setFrameIdx] = useState(0);
  const [showAR, setShowAR] = useState(false);
  const [showOrder, setShowOrder] = useState(false);

  const size = SIZE_TIERS[sizeIdx];
  const frame = FRAMES[frameIdx];

  return (
    <div className="container-page py-10 md:py-14">
      <Link
        href="/discover"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} className="rtl:rotate-180" />
        {t.back}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Image */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lift">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={painting.imageUrl}
            alt={`${painting.title} by ${painting.artist}`}
            className="w-full object-cover"
          />
        </div>

        {/* Options */}
        <div>
          <p className="eyebrow">{dict.discover.categories[painting.category as keyof typeof dict.discover.categories] ?? painting.category}</p>
          <h1 className="mt-3 text-balance text-3xl md:text-4xl">{painting.title}</h1>
          <p className="mt-2 text-muted-foreground">
            {t.by} {painting.artist}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">{t.note}</p>

          {/* Size */}
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t.size}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {SIZE_TIERS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setSizeIdx(i)}
                  aria-pressed={i === sizeIdx}
                  className={cn(
                    "rounded-xl border p-3 text-start transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    i === sizeIdx ? "border-primary bg-primary/5" : "border-border hover:border-gold/50"
                  )}
                >
                  <span className="block text-sm font-medium">{dict.sizes.tiers[i].name}</span>
                  <span className="block text-xs text-muted-foreground">{dict.sizes.tiers[i].dims}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frame */}
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{t.frame}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FRAMES.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setFrameIdx(i)}
                  aria-pressed={i === frameIdx}
                  className={cn(
                    "inline-flex min-h-[44px] items-center rounded-full border px-4 text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    i === frameIdx
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                  )}
                >
                  {dict.sizes.frames[i]}
                </button>
              ))}
            </div>
          </div>

          {/* Complexity (intrinsic to the artwork) */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t.complexity}
            </span>
            <span className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
              {t.complexities[painting.complexity]}
            </span>
          </div>

          {/* Total */}
          <div className="mt-6 flex items-baseline justify-between border-t border-border pt-6">
            <span className="text-sm text-muted-foreground">{t.total}</span>
            <span className="font-serif text-3xl">
              {formatPrice(locale, size.id, frame.id, painting.complexity)}
            </span>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="secondary" size="lg" className="w-full sm:flex-1" onClick={() => setShowAR(true)}>
              <Camera size={18} /> {t.preview}
            </Button>
            <Button size="lg" className="w-full sm:flex-1" onClick={() => setShowOrder(true)}>
              <Send size={18} /> {t.request}
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{dict.sizes.disclaimer}</p>
        </div>
      </div>

      {showAR && (
        <WallPreview
          imageUrl={painting.imageUrl}
          title={painting.title}
          frame={frame.id}
          onClose={() => setShowAR(false)}
        />
      )}
      {showOrder && (
        <OrderForm
          painting={painting}
          sizeId={size.id}
          frameId={frame.id}
          sizeLabel={dict.sizes.tiers[sizeIdx].name}
          frameLabel={dict.sizes.frames[frameIdx]}
          complexityId={painting.complexity}
          complexityLabel={t.complexities[painting.complexity]}
          onClose={() => setShowOrder(false)}
        />
      )}
    </div>
  );
}
