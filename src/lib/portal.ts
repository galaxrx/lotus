// Shared shapes for the artist portal (Supabase `artist_profiles` + `artworks`).
// Column names are snake_case to match the SQL schema.

export interface ArtistProfile {
  id: string;
  handle: string;
  display_name: string;
  bio_en: string;
  bio_fa: string;
  city: string;
  instagram: string;
  website: string;
  price_min_toman: number | null;
  price_min_usd: number | null;
  avatar_url: string | null;
  published: boolean;
}

export interface Artwork {
  id: string;
  artist_id: string;
  title_en: string;
  title_fa: string;
  style: string;
  medium: string;
  dimensions: string;
  year: number | null;
  description_en: string;
  description_fa: string;
  price_toman: number | null;
  price_usd: number | null;
  for_sale: boolean;
  image_url: string;
  published: boolean;
  created_at?: string;
}

/** A handle is the artist's URL slug: lowercase letters, numbers, hyphens. */
export function normalizeHandle(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}
