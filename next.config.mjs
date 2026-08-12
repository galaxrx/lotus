/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

// Supabase project origin (auth, database, and public Storage) — derived from the
// public URL so the CSP stays in sync with wherever the project points. Empty when
// Supabase isn't configured (the portal degrades gracefully in that case).
const supabaseOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin
  : "";

// Content Security Policy. 'unsafe-inline' is required for the pre-paint theme
// script and inline styles; 'unsafe-eval' is only added in development for HMR.
// Images allow The Met (catalog) and Wikimedia Commons (public-domain abstract
// works) and Supabase Storage (artist uploads), plus data: (snapshots) and blob:
// (uploaded wall photos). connect-src allows Supabase (auth/db/storage). Camera
// access for the AR preview is granted via Permissions-Policy.
const csp = [
  "default-src 'self'",
  `img-src 'self' data: blob: https://images.metmuseum.org https://upload.wikimedia.org${supabaseOrigin ? ` ${supabaseOrigin}` : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  `connect-src 'self'${supabaseOrigin ? ` ${supabaseOrigin}` : ""}`,
  "media-src 'self' blob:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.metmuseum.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
