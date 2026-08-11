/**
 * Centralized environment access.
 *
 * Values are read lazily (at call time, not module load) so that `next build`
 * and static rendering never fail on a missing secret, and so secrets are only
 * required by the code paths that actually use them.
 *
 * SECURITY: Only NEXT_PUBLIC_* values are safe to reach the browser bundle.
 * Never read SUPABASE_SERVICE_ROLE_KEY / DATABASE_URL from client components.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optional(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

/** Public config — safe to expose to the browser. */
export const publicEnv = {
  get supabaseUrl() {
    return required("NEXT_PUBLIC_SUPABASE_URL");
  },
  get supabaseAnonKey() {
    return required("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  },
  get appUrl() {
    return optional("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000";
  },
};

/** Server-only secrets. Importing this object is fine; reading a getter is what enforces presence. */
export const serverEnv = {
  get supabaseServiceRoleKey() {
    return required("SUPABASE_SERVICE_ROLE_KEY");
  },
  get databaseUrl() {
    return required("DATABASE_URL");
  },
  get aiApiKey() {
    return optional("AI_API_KEY");
  },
  get stripeWebhookSecret() {
    return optional("STRIPE_WEBHOOK_SECRET");
  },
  get telegramBotToken() {
    return optional("TELEGRAM_BOT_TOKEN");
  },
  get telegramChatId() {
    return optional("TELEGRAM_CHAT_ID");
  },
  /** Public auction channel the owner forwards anonymized offers to (display only). */
  get telegramChannel() {
    return optional("TELEGRAM_CHANNEL");
  },
  /** Gate for the /admin escrow dashboard. */
  get adminToken() {
    return optional("ADMIN_TOKEN");
  },
  /** Owner's card-to-card / Sheba details, shown on the deposit-instruction page. */
  get ownerCardNumber() {
    return optional("OWNER_CARD_NUMBER");
  },
  get ownerCardHolder() {
    return optional("OWNER_CARD_HOLDER");
  },
  get ownerSheba() {
    return optional("OWNER_SHEBA");
  },
  /** Comma-separated allowlist of hostnames the URL importer may fetch. */
  get importAllowlist(): string[] {
    return (optional("IMPORT_URL_ALLOWLIST") ?? "")
      .split(",")
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean);
  },
};

export const isProd = process.env.NODE_ENV === "production";
