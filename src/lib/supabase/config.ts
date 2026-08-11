// True when Supabase Auth/Storage are wired. Both values are NEXT_PUBLIC_* so this
// works on the server and in the browser bundle, and it never throws — the portal
// degrades to an "opening soon" state when Supabase isn't configured.
export function supabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export const ARTWORKS_BUCKET = "artworks";
