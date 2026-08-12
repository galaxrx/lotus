// Human labels for the catalog's art-movement slugs, in both languages. The slugs
// (e.g. "post-impressionism") are the storage form; these are what people read.
// Persian uses the transliterated movement names Iranian art writing actually uses.

import type { Locale } from "@/i18n/config";

const FA: Record<string, string> = {
  baroque: "باروک",
  botanical: "گیاه‌نگاری",
  "dutch-golden-age": "عصر طلایی هلند",
  impressionism: "امپرسیونیسم",
  "modern-abstract": "انتزاعی مدرن",
  naturalism: "ناتورالیسم",
  neoclassicism: "نئوکلاسیک",
  pointillism: "پوانتیلیسم",
  "post-impressionism": "پسا‌امپرسیونیسم",
  realism: "رئالیسم",
  renaissance: "رنسانس",
  rococo: "روکوکو",
  romanticism: "رمانتیسم",
  "still-life-tradition": "طبیعت بی‌جان",
  symbolism: "سمبولیسم",
};

const EN: Record<string, string> = {
  "dutch-golden-age": "Dutch Golden Age",
  "modern-abstract": "Modern abstract",
  "post-impressionism": "Post-impressionism",
  "still-life-tradition": "Still life",
};

/** Readable name for a style slug in the given locale. Falls back to the slug. */
export function styleLabel(slug: string, locale: Locale): string {
  if (locale === "fa" && FA[slug]) return FA[slug];
  if (EN[slug]) return EN[slug];
  const spaced = slug.replace(/-/g, " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
