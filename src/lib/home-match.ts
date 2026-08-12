// "What suits your home?" recommender. Pure + in-memory, like the rest of the
// catalog logic. Four taste inputs (furniture colour, home style, room light and
// preferred look) each contribute weights to a painting's tone, art movement and
// subject; we score the whole catalog and return the best matches.

import { PAINTINGS, type Painting, type Category, type Tone, type Style } from "@/data/paintings";

export type FurnitureColor = "warm-wood" | "cool-grey" | "bright-white" | "bold-colour" | "dark-moody";
export type HomeStyle = "modern-minimal" | "classic-traditional" | "cosy-rustic" | "airy-scandi" | "eclectic-artistic";
export type Light = "bright" | "soft" | "dim";
export type Look = "impressionist" | "classic" | "modern" | "floral" | "landscape" | "any";

export interface MatchAnswers {
  furniture?: FurnitureColor | null;
  home?: HomeStyle | null;
  light?: Light | null;
  look?: Look | null;
}

type Weights = {
  tone?: Partial<Record<Tone, number>>;
  style?: Partial<Record<Style, number>>;
  category?: Partial<Record<Category, number>>;
};

// Furniture colour → the palette that sits well against it.
const FURNITURE: Record<FurnitureColor, Weights> = {
  "warm-wood": { tone: { warm: 3, earthy: 2 } },
  "cool-grey": { tone: { cool: 3, muted: 2 } },
  "bright-white": { tone: { muted: 2, cool: 1, vivid: 1 } },
  "bold-colour": { tone: { vivid: 3, warm: 1 } },
  "dark-moody": { tone: { earthy: 2, muted: 2, vivid: 1 } },
};

// Home style → the movements and subjects that tend to belong there.
const HOME: Record<HomeStyle, Weights> = {
  "modern-minimal": { style: { "modern-abstract": 3, pointillism: 1 }, category: { abstract: 2 }, tone: { muted: 1 } },
  "classic-traditional": {
    style: { renaissance: 2, baroque: 2, "dutch-golden-age": 2, neoclassicism: 2, "still-life-tradition": 1 },
    category: { portrait: 1, "still-life": 1 },
  },
  "cosy-rustic": { style: { naturalism: 2, realism: 2, romanticism: 2 }, category: { landscape: 1, animals: 1 }, tone: { earthy: 1, warm: 1 } },
  "airy-scandi": { style: { impressionism: 2, botanical: 2 }, category: { floral: 1, landscape: 1 }, tone: { cool: 1, muted: 1 } },
  "eclectic-artistic": { style: { "post-impressionism": 2, symbolism: 2, rococo: 1 }, category: { figures: 1 }, tone: { vivid: 1 } },
};

// Room light → a dim room wants luminous, warm pieces; a bright room can carry moodier ones.
const LIGHT: Record<Light, Weights> = {
  bright: { tone: { earthy: 1, muted: 1, cool: 1 } },
  soft: { tone: { warm: 1, earthy: 1 } },
  dim: { tone: { vivid: 2, warm: 2 } },
};

// Preferred look → a friendly grouping over the 15 movements.
const LOOK: Record<Look, Weights> = {
  impressionist: { style: { impressionism: 3, "post-impressionism": 2, pointillism: 1 } },
  classic: { style: { renaissance: 3, baroque: 2, "dutch-golden-age": 2, neoclassicism: 2 } },
  modern: { style: { "modern-abstract": 3 }, category: { abstract: 2 } },
  floral: { category: { floral: 3, "still-life": 1 }, style: { botanical: 2, "still-life-tradition": 1 } },
  landscape: { category: { landscape: 3 }, style: { naturalism: 1, romanticism: 1 } },
  any: {},
};

function scoreOne(p: Painting, weights: Weights[]): number {
  let s = 0;
  for (const w of weights) {
    s += w.tone?.[p.tone] ?? 0;
    s += w.style?.[p.style] ?? 0;
    s += w.category?.[p.category] ?? 0;
  }
  return s;
}

export interface MatchResult {
  painting: Painting;
  score: number;
}

/**
 * Rank the catalog against the given answers, best first. Returns every painting
 * that matches at all (positive score) so the caller can show as many as it likes;
 * pass `limit` to cap the count. With no answers it returns nothing (the caller
 * shows the quiz instead).
 */
export function matchPaintings(a: MatchAnswers, limit?: number): MatchResult[] {
  const weights: Weights[] = [];
  if (a.furniture) weights.push(FURNITURE[a.furniture]);
  if (a.home) weights.push(HOME[a.home]);
  if (a.light) weights.push(LIGHT[a.light]);
  if (a.look && a.look !== "any") weights.push(LOOK[a.look]);
  if (weights.length === 0) return [];

  const positive = PAINTINGS.map((p) => ({ painting: p, score: scoreOne(p, weights) }))
    .filter((s) => s.score > 0)
    .sort((x, y) => y.score - x.score || x.painting.id - y.painting.id);

  return typeof limit === "number" ? positive.slice(0, limit) : positive;
}

export const FURNITURE_OPTIONS: FurnitureColor[] = ["warm-wood", "cool-grey", "bright-white", "bold-colour", "dark-moody"];
export const HOME_OPTIONS: HomeStyle[] = ["modern-minimal", "classic-traditional", "cosy-rustic", "airy-scandi", "eclectic-artistic"];
export const LIGHT_OPTIONS: Light[] = ["bright", "soft", "dim"];
export const LOOK_OPTIONS: Look[] = ["impressionist", "classic", "modern", "floral", "landscape", "any"];
