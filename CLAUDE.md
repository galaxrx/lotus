# CLAUDE.md — Niloosa engineering notes

Guidance for engineers/agents working in this repo.

## What Niloosa is

A hand-painted wall-art commissioning app. A visitor browses public-domain
paintings, previews one on their wall (camera AR), and submits a **guest** order
(no account) which is delivered to the painter on Telegram. Bilingual EN/FA + RTL.

## Architecture

- **App Router**, all UI in `src/app` + `src/components`.
- **Catalog** is curated public-domain art from The Met, in `src/data/paintings.ts`
  (typed: category + color tone). Filtering/recommendation is pure, in-memory
  (`src/lib/catalog.ts`).
- **Pricing** is server-authoritative: size + frame tiers with numeric prices in
  `src/lib/config.ts`; `computePrice()` is the single source of truth. Never trust a
  client-sent price.
- **Orders**: `POST /api/orders` (`src/app/api/orders/route.ts`) validates with Zod,
  enforces **same-origin (CSRF)** + **per-IP rate limit**, computes price server-side,
  persists via Prisma if a DB is configured (else demo mode), and dispatches to Telegram.
- **Telegram** (`src/lib/telegram.ts`): first-party Bot API call. No-op ("stubbed")
  when `TELEGRAM_BOT_TOKEN`/`TELEGRAM_CHAT_ID` are unset.
- **AR preview** (`src/components/ar/wall-preview.tsx`): camera or uploaded wall photo +
  draggable/resizable framed overlay + snapshot. Needs `Permissions-Policy: camera=(self)`
  (set in `next.config.mjs`) and HTTPS in production.
- **Rate limiter** (`src/lib/rate-limit.ts`): shared atomic Postgres store, with an
  in-process fallback if the DB is briefly unavailable.
- **i18n** (`src/i18n`): `en` defines the dictionary shape; `fa` must match it. Locale is
  resolved server-side from the `NEXT_LOCALE` cookie. Add strings to BOTH languages.

## Security

- Security headers + a **Content-Security-Policy** are in `next.config.mjs` (self + The Met
  images + Wikimedia Commons images (public-domain abstract works) + Google Fonts;
  `camera=(self)` for AR). Keep the CSP in sync when adding external hosts.
- No user accounts, no service-role keys, no user-tenant data — the app is deliberately
  minimal. Order data (name/contact/address) is shared only with the painter via Telegram.

## Conventions

- Colors via CSS variables (`src/app/globals.css`) → Tailwind tokens. No raw hex in components.
- Icons: `lucide-react` only. UI primitives follow shadcn (`src/components/ui`, `components.json`).
- Use logical CSS (`start`/`end`, `ms`/`me`, `rtl:` variants) so RTL works.

## Do not

- Commit secrets (`.env` is git-ignored; `.env.example` documents the shape).
- Trust client-provided prices, or send order side-effects the server hasn't validated.
