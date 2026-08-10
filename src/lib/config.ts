// Commerce config: canvas size tiers and frames with numeric prices.
// Order is index-aligned with dict.sizes.tiers / dict.sizes.frames so the UI
// labels stay localized while the server computes prices from these numbers.
// The server is the ONLY source of truth for price — client values are ignored.

export interface SizeTier {
  id: "S" | "M" | "L" | "XL";
  priceUsd: number;
}
export interface FrameOption {
  id: "none" | "wood" | "black" | "white";
  priceUsd: number;
}

export const SIZE_TIERS: SizeTier[] = [
  { id: "S", priceUsd: 120 },
  { id: "M", priceUsd: 220 },
  { id: "L", priceUsd: 360 },
  { id: "XL", priceUsd: 540 },
];

export const FRAMES: FrameOption[] = [
  { id: "none", priceUsd: 0 },
  { id: "wood", priceUsd: 40 },
  { id: "black", priceUsd: 35 },
  { id: "white", priceUsd: 35 },
];

export function sizeById(id: string): SizeTier | undefined {
  return SIZE_TIERS.find((s) => s.id === id);
}
export function frameById(id: string): FrameOption | undefined {
  return FRAMES.find((f) => f.id === id);
}

/** Authoritative price for a (size, frame) combination, in USD. */
export function computePrice(sizeId: string, frameId: string): number | null {
  const s = sizeById(sizeId);
  const f = frameById(frameId);
  if (!s || !f) return null;
  return s.priceUsd + f.priceUsd;
}

// Budget buckets for discovery (index-aligned with dict.discover.budgets).
export const BUDGET_MAX = [200, 400, Infinity];
