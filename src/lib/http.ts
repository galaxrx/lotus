import "server-only";
import type { User } from "@supabase/supabase-js";

/**
 * Same-origin check for state-changing requests (CSRF defence-in-depth).
 *
 * Browsers always attach an `Origin` header to cross-site POST/DELETE. We
 * require it to match the request's own host. This complements the Supabase
 * cookie's SameSite protection rather than relying on it alone.
 */
export function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  // Same-origin navigations/fetches send Origin for mutating methods. If it is
  // absent (e.g. a non-browser client), fall back to the Referer host.
  const host = req.headers.get("host");
  if (!host) return false;

  const candidate = origin ?? req.headers.get("referer");
  if (!candidate) return false;

  try {
    return new URL(candidate).host === host;
  } catch {
    return false;
  }
}

/** True only when Supabase has confirmed the user's email. */
export function isEmailVerified(user: User): boolean {
  // Supabase sets email_confirmed_at once the address is verified.
  return Boolean((user as { email_confirmed_at?: string }).email_confirmed_at);
}
