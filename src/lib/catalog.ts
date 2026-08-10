import { PAINTINGS, type Painting, type Category, type Tone } from "@/data/paintings";
import { SIZE_TIERS } from "@/lib/config";

export interface CatalogFilter {
  category?: Category | null;
  tone?: Tone | null;
  budgetIndex?: number | null; // index into BUDGET_MAX, or null for any
}

/**
 * Filter the catalog by theme (category) and color tone. Budget doesn't remove
 * artworks (every piece is available at any size); it just narrows which size
 * tiers are affordable, which we surface downstream. Pure + in-memory.
 */
export function filterPaintings(f: CatalogFilter): Painting[] {
  return PAINTINGS.filter((p) => {
    if (f.category && p.category !== f.category) return false;
    if (f.tone && p.tone !== f.tone) return false;
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
];

export const TONES: Tone[] = ["warm", "cool", "earthy", "vivid", "muted"];
