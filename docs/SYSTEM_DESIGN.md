# Niloosa — Marketplace & Artist-Portal System Design

Status: proposed → in build. This document is the source of truth for the seven
workstreams requested. It supersedes the "single painter" framing: Niloosa becomes
a **curated commission marketplace** connecting customers who want a hand-painted
reproduction with a roster of vetted artists, mediated by the app owner as escrow.

## 0. Constraints that shape every decision

- **No online payment processor.** The app assumes no Stripe/PayPal. All money moves
  by **card-to-card / bank transfer (IBAN)**, confirmed **manually** by the owner.
  The software never touches funds — it orchestrates instructions, tracking codes,
  and state.
- **Anonymity until money is down.** Customer and artist must not be able to reach
  each other until the deposit is confirmed. Contact fields are server-only and
  released exactly once, at `deposit_confirmed`.
- **Graceful degradation.** Like the existing Telegram/DB code, every external
  dependency (Supabase Auth/Storage, Telegram, DB) is optional at runtime: absent
  config ⇒ a clearly-labelled stub, never a crash. Keeps local/demo working.
- **Bilingual, RTL-first.** Every string ships in `en` and `fa`. Money shows Toman
  for `fa`, USD for `en`.
- **Cost discipline.** No new recurring cloud spend provisioned autonomously. A
  dedicated Supabase project is $10/mo on this org and is left as an explicit
  deploy-time go/no-go.

## 1. Roles

| Role | Auth | Can |
|------|------|-----|
| Visitor / Customer | none (guest) | browse, filter, AR-preview, make a priced offer, pay deposit, track by ref |
| Artist | Supabase Auth | profile (bio EN/FA, pricing), upload artworks, (later) claim commissions |
| Owner / Admin | `ADMIN_TOKEN` | confirm deposits, reveal contacts, advance status, take 10% |

## 2. Catalog (Workstream 1 & 6)

Two independent sources, one unified card:

- **Curated public-domain catalog** — 500+ works pulled from The Met Open Access
  API (`collectionapi.metmuseum.org`), spanning art movements + Persian/Islamic
  **calligraphy**. Stored in `src/data/paintings.ts` with **full image URLs**
  (`img`) so departments beyond European Paintings resolve. `Painting` gains a
  `style` (art-movement) field alongside `category`/`tone`/`complexity`.
- **Artist-uploaded artworks** — live in Supabase (`artworks` table + Storage),
  surfaced in a dedicated "Ateliers" gallery segment.

Build method: a generator script (`scripts/build-catalog.mjs`) queries the Met API
across ~25 curated buckets (impressionism, baroque, ukiyo-e, calligraphy, …),
keeps `isPublicDomain && primaryImage`, dedupes by objectID, and assigns
category/tone/complexity heuristically. Deterministic, re-runnable, committed output.

## 3. Offer / auction flow (Workstream 2, 3, 5)

```
Customer: filter → pick painting → AR preview → "Make an offer"
  form: size, frame, offered price (Toman for fa / USD for en), name, contact, address, note
    │  server computes a suggested floor from size+frame+complexity (config.ts) — the
    │  offer may sit above or below; below-floor offers are flagged, not blocked.
    ▼
POST /api/orders  (same-origin + rate-limit + Zod)  → persists Commission (status=offer_pending)
    ▼
Telegram → OWNER (private):  full card WITH customer details + offered price
                             + a pre-formatted "CHANNEL POST" block (NO customer details)
    ▼
Owner copies the channel block → posts to the public artists' channel for auction.
Artists see: painting, size/frame, offered price, ref — never the customer.
```

The offered price is the headline number in both the owner card and the channel post.

## 4. Escrow / deposit (Workstream 4 — the money model)

Lifecycle (single `status` enum on `Commission`):

```
offer_pending ─▶ artist_matched ─▶ deposit_pending ─▶ deposit_confirmed ─▶ in_progress
                                                          │(contacts revealed)      │
                                                          ▼                         ▼
                                                      cancelled                 delivered ─▶ completed
```

- **Deposit** = 30% of the accepted offer (configurable), paid card-to-card to the
  owner's account. The app renders a **deposit instruction**: owner card/Sheba,
  exact amount, and the commission `ref` as the transfer memo. Customer submits the
  **bank tracking code** (`POST /api/commissions/:ref/deposit`).
- **Owner confirms** receipt in the admin dashboard (`ADMIN_TOKEN`). Only then does
  `deposit_confirmed` fire and the customer↔artist contact bridge open. This is the
  anonymity gate.
- **Delivery → completion.** Customer pays the remaining 70% on delivery (again
  card-to-card). Owner marks `completed`, keeps **10% commission**, forwards the
  rest to the artist. All amounts are recorded; no funds flow through code.

Security: contact fields never leave the server before `deposit_confirmed`; admin
routes are constant-time-compared token guarded; deposit tracking code is
write-once; status transitions are validated against an allowed-transition map.

## 5. Artist portal (Workstream 1)

- **Auth:** Supabase Auth (email + password). Session via `@supabase/ssr`.
- **Profile:** display name, handle, bio_en, bio_fa, city, socials, optional
  `price_min_toman` / `price_min_usd`, avatar. RLS: an artist edits only their row.
- **Artworks:** image (Storage bucket `artworks`, artist-scoped path), title_en/fa,
  style, medium, dimensions, description_en/fa, year, price_toman/usd (optional),
  `for_sale`. RLS: owner writes; public reads `published` rows.
- **Surfacing:** an "Ateliers / آتلیه‌ها" section renders published artworks in the
  same luxury card system as the catalog, with an artist byline linking to a public
  profile page.
- **Degradation:** without Supabase env, portal routes render an on-brand
  "opening soon" state and the APIs return a typed `unconfigured` result.

## 6. About Us (Workstream 2)

`/artist` → `/about` (old path 308-redirects). Nav label becomes "About us /
درباره ما". Adds a founding-story section (why Niloosa exists) in EN + FA, humanized.

## 7. AR upgrade (Workstream 7)

`wall-preview.tsx` gains: a **frame picker** (none / wood / black / white / gold)
with matting, a realistic **drop shadow** + inner bevel, a subtle **wall-light
vignette**, aspect-locked resize, and the chosen frame is baked into the snapshot.
Frame choice round-trips into the offer so the Telegram card matches the preview.

## 8. Data model (Prisma additions)

- `Commission` (supersedes `Order`; `Order` kept as alias/migration): adds
  `offeredPriceToman`, `offeredPriceUsd`, `currency`, `status`, `depositToman`,
  `depositTrackingCode`, `artistId?`, `channelPostedAt?`, timestamps.
- Supabase tables (RLS): `artist_profiles`, `artworks`. Managed via SQL migration,
  applied only once real Supabase is wired.

## 9. Peer review

Codex CLI is **not installed** on this machine, so the requested Codex peer role is
substituted with internal adversarial review (security + correctness passes) on the
escrow, auth-boundary, and price-trust code paths before each commit.
