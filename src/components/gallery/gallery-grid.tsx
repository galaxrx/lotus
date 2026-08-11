"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Maximize2, Send, X } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { PAINTINGS, imageOf } from "@/data/paintings";

/**
 * Scrollable masonry gallery. Clicking any piece opens a full-size lightbox
 * (Esc / backdrop / ✕ to close, ← → to page through). Body scroll is locked
 * only while the lightbox is open, so closing returns the reader exactly where
 * they were and scrolling continues.
 */
export function GalleryGrid() {
  const { dict } = useI18n();
  const g = dict.gallery;
  const [active, setActive] = useState<number | null>(null);
  const open = active !== null;
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + PAINTINGS.length) % PAINTINGS.length)),
    []
  );
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % PAINTINGS.length)),
    []
  );

  // While the lightbox is open: lock body scroll, wire keyboard controls, move
  // focus into the dialog, and restore focus to the trigger on close. Keyed on
  // `open` (not `active`) so paging with ← → doesn't thrash scroll/focus.
  useEffect(() => {
    if (!open) return;
    const restoreFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      restoreFocus?.focus?.();
    };
  }, [open, close, next, prev]);

  const item = active === null ? null : PAINTINGS[active];

  return (
    <div className="container-page py-14 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">{dict.nav.gallery}</p>
        <h1 className="mt-4 text-balance text-4xl leading-tight md:text-5xl">{g.title}</h1>
        <p className="mt-4 text-pretty text-muted-foreground">{g.subtitle}</p>
      </div>

      {/* Uniform grid — equal tiles keep the rows aligned on every screen.
          Full, uncropped images live in the lightbox on tap. */}
      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {PAINTINGS.map((p, i) => (
          <figure key={p.id}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${g.view} — ${p.title}`}
              className="group relative block w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-surface shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageOf(p)}
                alt={`${p.title} — ${p.artist}`}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <span className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">{p.title}</span>
                  <span className="block truncate text-xs text-white/70">
                    {dict.common.by} {p.artist}
                  </span>
                </span>
              </span>
              <span className="pointer-events-none absolute end-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                <Maximize2 size={15} />
              </span>
            </button>
          </figure>
        ))}
      </div>

      {/* Lightbox */}
      {item && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
          onClick={close}
        >
          <button
            ref={closeBtnRef}
            onClick={close}
            aria-label={g.close}
            className="absolute end-4 top-4 z-10 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <X size={20} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label={g.prev}
            className="absolute start-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft size={22} className="rtl:rotate-180" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label={g.next}
            className="absolute end-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight size={22} className="rtl:rotate-180" />
          </button>

          <figure
            className="flex max-h-full max-w-5xl flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageOf(item)}
              alt={`${item.title} — ${item.artist}`}
              className="max-h-[78vh] w-auto max-w-full rounded-lg object-contain shadow-2xl"
            />
            <figcaption className="mt-4 flex flex-col items-center gap-2 text-center">
              <span className="font-serif text-lg text-white">{item.title}</span>
              <span className="text-sm text-white/70">
                {dict.common.by} {item.artist} · {dict.discover.categories[item.category]}
              </span>
              <Link
                href={`/art/${item.id}`}
                className="mt-1 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
              >
                <Send size={15} /> {g.request}
              </Link>
            </figcaption>
          </figure>
        </div>
      )}
    </div>
  );
}
