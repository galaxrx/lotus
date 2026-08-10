// Commerce config: canvas size, painting complexity, and frame — each with
// numeric prices. Size + frame indices are aligned with dict.sizes.tiers /
// dict.sizes.frames so the UI labels stay localized while the server computes
// prices from these numbers. Complexity is an intrinsic property of the chosen
// painting (from the catalog), not a client-selected option.
//
// The server is the ONLY source of truth for price — client values are ignored.
//
// Two currencies are carried: USD for the English audience and Iranian toman for
// the Persian audience. The toman ladder is tuned so any real combination lands
// between 3,000,000 and 20,000,000 toman:
//   min  S + simple + no frame      = 3,000,000
//   max  XL + intricate + wood frame = 13M + 5M + 2M = 20,000,000

import type { Complexity } from "@/data/paintings";

export interface SizeTier {
  id: "S" | "M" | "L" | "XL";
  priceUsd: number;
  priceToman: number;
}
export interface FrameOption {
  id: "none" | "wood" | "black" | "white";
  priceUsd: number;
  priceToman: number;
}
export interface ComplexityTier {
  id: Complexity;
  priceUsd: number;
  priceToman: number;
}

export const SIZE_TIERS: SizeTier[] = [
  { id: "S", priceUsd: 120, priceToman: 3_000_000 },
  { id: "M", priceUsd: 200, priceToman: 6_000_000 },
  { id: "L", priceUsd: 320, priceToman: 9_000_000 },
  { id: "XL", priceUsd: 480, priceToman: 13_000_000 },
];

// Surcharge for how demanding the artwork is to hand-paint.
export const COMPLEXITY_TIERS: ComplexityTier[] = [
  { id: "simple", priceUsd: 0, priceToman: 0 },
  { id: "involved", priceUsd: 90, priceToman: 2_500_000 },
  { id: "intricate", priceUsd: 180, priceToman: 5_000_000 },
];

export const FRAMES: FrameOption[] = [
  { id: "none", priceUsd: 0, priceToman: 0 },
  { id: "wood", priceUsd: 40, priceToman: 2_000_000 },
  { id: "black", priceUsd: 35, priceToman: 1_500_000 },
  { id: "white", priceUsd: 35, priceToman: 1_500_000 },
];

export function sizeById(id: string): SizeTier | undefined {
  return SIZE_TIERS.find((s) => s.id === id);
}
export function frameById(id: string): FrameOption | undefined {
  return FRAMES.find((f) => f.id === id);
}
export function complexityById(id: string): ComplexityTier | undefined {
  return COMPLEXITY_TIERS.find((c) => c.id === id);
}

/** Authoritative USD price for a (size, frame, complexity) combination. */
export function computePrice(sizeId: string, frameId: string, complexityId: string): number | null {
  const s = sizeById(sizeId);
  const f = frameById(frameId);
  const c = complexityById(complexityId);
  if (!s || !f || !c) return null;
  return s.priceUsd + f.priceUsd + c.priceUsd;
}

/** Authoritative toman price for a (size, frame, complexity) combination. */
export function computePriceToman(sizeId: string, frameId: string, complexityId: string): number | null {
  const s = sizeById(sizeId);
  const f = frameById(frameId);
  const c = complexityById(complexityId);
  if (!s || !f || !c) return null;
  return s.priceToman + f.priceToman + c.priceToman;
}

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Format a toman amount with Persian digits and thousands separators, e.g. "۲۰٬۰۰۰٬۰۰۰ تومان". */
export function formatToman(amount: number): string {
  const grouped = amount
    .toLocaleString("en-US")
    .replace(/,/g, "٬")
    .replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
  return `${grouped} تومان`;
}

/** Locale-aware price label for a (size, frame, complexity) trio: toman for `fa`, USD otherwise. */
export function formatPrice(
  locale: string,
  sizeId: string,
  frameId: string,
  complexityId: string
): string {
  if (locale === "fa") {
    return formatToman(computePriceToman(sizeId, frameId, complexityId) ?? 0);
  }
  return `$${computePrice(sizeId, frameId, complexityId) ?? 0}`;
}

// Budget buckets for discovery (index-aligned with dict.discover.budgets).
export const BUDGET_MAX = [200, 400, Infinity];
