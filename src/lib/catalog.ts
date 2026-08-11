import { PAINTINGS, type Painting, type Category, type Tone, type Style } from "@/data/paintings";
import { SIZE_TIERS } from "@/lib/config";

export interface CatalogFilter {
  category?: Category | null;
  tone?: Tone | null;
  style?: Style | null;
  budgetIndex?: number | null; // index into BUDGET_MAX, or null for any
}

/**
 * Filter the catalog by theme (category), colour tone and art movement (style).
 * Budget doesn't remove artworks (every piece is available at any size); it just
 * narrows which size tiers are affordable, which we surface downstream. Pure + in-memory.
 */
export function filterPaintings(f: CatalogFilter): Painting[] {
  return PAINTINGS.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    if (f.tone && p.tone !== f.tone) return false;
    if (f.style && p.style !== f.style) return false;
    return true;
  });
}

export function getPainting(id: number): Painting | undefined {
  return PAINTINGS.find((p) => p.id === id);
}

/** Cheapest size tier within a budget, or the smallest if none fit. */
export function suggestedSizeForBudget(maxUsd: number) {
  const affordable = SIZE_TIERS.filter((s) => s.priceUsd <= maxUsd);
  return (affordable.length ? affordable[affordable.length - 1] : SIZE_TIERS[0]).id;
}

export const CATEGORIES: Category[] = [
  "landscape",
  "portrait",
  "floral",
  "still-life",
  "figures",
  "animals",
  "abstract",
  "calligraphy",
];

export const TONES: Tone[] = ["warm", "cool", "earthy", "vivid", "muted"];

/** Art movements present in the catalog, most-represented first. */
export const STYLES: Style[] = (() => {
  const counts = new Map<Style, number>();
  for (const p of PAINTINGS) counts.set(p.style, (counts.get(p.style) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s);
})();
