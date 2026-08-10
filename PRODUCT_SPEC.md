# Lotus — Product Spec (v1)

_Commission a real, hand-painted canvas for your wall._

Status: **DRAFT for approval.** No app code will change until this is approved.

---

## 1. Concept

Lotus helps someone find a real painting they love, **see it on their own wall in AR**,
and order a **hand-painted canvas reproduction** (real texture + painter's signature).
Artworks are **real, curated paintings from public-domain collections** — not AI-generated —
filtered by an engine, so they are authentic *and* legal to reproduce and sell.

## 2. Primary user flow (buyer)

1. **Set taste** — choose *theme/style*, *color tone*, and *price range*.
2. **Get recommendations** — the engine returns a few matching paintings from the catalog.
3. **Preview on your wall (AR)** — point the phone camera at the wall, place the framed
   canvas at real size, reposition, and snapshot.
4. **Request it** — pick size + frame, enter contact/shipping, confirm.
5. **Order → Telegram** — order details are sent to the painter's Telegram automatically.
6. **Track it** — painter updates status (Requested → Accepted → Painting → Shipped →
   Delivered); the buyer sees progress in-app.

## 3. Art sourcing engine (the core differentiator)

**Sources (public domain / open license — legal to reproduce & sell):**
- The Met Open Access API · Art Institute of Chicago API · Rijksmuseum API ·
  Cleveland Museum of Art Open Access · Wikimedia Commons (PD) · Smithsonian Open Access.

**Ingestion pipeline (server-side, curated):**
- Fetch artwork + metadata (title, artist, year, source, license, hi-res image).
- **Extract dominant colors** (median-cut/k-means) → store as HSL buckets for fast "color tone" filtering.
- Tag **category/theme** (landscape, floral, abstract, portrait, still life…) and **orientation/aspect ratio**.
- **Admin approves** items (quality + print resolution) before they go live.
- Only public-domain / open-licensed works are ingested. (Copyright note in §8.)

**Filter/recommend:**
- Match on: theme ∩ color-tone (nearest hue bucket) ∩ price tier.
- Price range maps to **canvas size tiers** (the artwork itself is free; price = painter labor + size + frame).
- Rank by color-match score + curation weight; return a small, tasteful set.

## 4. "See it on your wall" — phone-camera AR (web)

- Cross-platform web AR via **`<model-viewer>`**: generate a framed-canvas 3D asset per
  artwork+size (glTF for Android Scene Viewer, USDZ for iOS Quick Look), textured with the
  painting and scaled to the chosen real dimensions. No app install.
- **Fallback (works everywhere):** upload/take a wall photo and composite the framed
  painting onto it with drag/resize.
- Honest limitation: full markerless plane-tracking in a plain web page is device-dependent
  (best on Android Chrome / iOS Quick Look); the photo fallback guarantees everyone can preview.

## 5. Order → Telegram

- Telegram **Bot API** (bot token kept server-side as a secret).
- On order, the server sends the painter a message: thumbnail, title/artist, **size, frame,
  price**, buyer contact, order id — with inline buttons **Accept / Decline / Mark shipped**.
- Button taps hit a **Telegram webhook** → update order status in the DB → reflected in the app.
- Setup needed from you: create a bot via **@BotFather** (gives a token) and the painter's chat id.

## 6. Screens (MVP)

1. Landing (repurposed marketing hero) 2. Discover/preferences 3. Recommendations grid
4. Artwork detail + size/frame + "Preview on my wall" 5. AR preview 6. Request/checkout
7. Order confirmation + tracking 8. My orders 9. Auth (login/signup — reused)
10. Admin: catalog ingest/approve + orders board.

## 7. Data model (Prisma)

- **User** (buyer) · **Artwork** (source, artist, title, year, imageUrl, dominantColors[],
  category, aspectRatio, license, approved) · **SizeTier** (dimensions, priceModifier) ·
  **Frame** (style, price) · **Order** (userId, artworkId, sizeTier, frame, price, contact,
  shippingAddress, status, telegramMsgRef) · **OrderEvent** (status history) · **Favorite** (optional).

## 8. What carries over / what changes

**Reuse:** Lotus logo, botanical design system, EN + Persian/RTL, Supabase auth, Prisma,
and the security layer — including the **SSRF-guarded fetcher** (now genuinely used to pull
museum images/APIs server-side) and per-user authorization (a buyer only sees their own orders).

**Remove:** AI generation, credits, generation composer, team workspaces/orgs.

## 9. Legal note (important)

Only **public-domain / open-licensed** artworks are reproduced for sale. "Free to view on
Pinterest" is **not** a license to reproduce — that path is excluded by design.

## 10. MVP vs later

- **MVP:** preferences → recommendations (from 1–2 PD sources, pre-ingested & color-tagged)
  → detail → AR (model-viewer + photo fallback) → order → Telegram notify → basic status.
- **Later:** in-app payments, multiple painters, shipping integration, reviews, wishlists,
  more sources, richer AR, buyer accounts optional vs required.

## 11. Resolved decisions ✅

- **Payment:** arranged **offline via Telegram** (no in-app payment for MVP).
- **Ordering identity:** **guest checkout** (name + contact + shipping); optional account to track orders.
- **Painters:** **one painter (you)** — all orders go to a single Telegram chat.
- **Sizes/prices/frames:** **sensible defaults** (see below), editable later.

**Default size tiers** (placeholders): S 30×40 cm · M 50×70 cm · L 70×100 cm · XL 90×120 cm.
**Default frames:** None (rolled canvas), Natural wood, Black, White.
Price = base painter labor × size tier (+ frame). Placeholder numbers; you tune later.

## 12. Build order (MVP milestones)

1. **Reset scaffold** — strip AI/credits/workspaces; keep logo, design system, EN/FA, auth, security libs.
2. **Data + catalog** — Prisma models (Artwork, Order, etc.); ingest script for 1–2 PD sources with
   color extraction + tagging; seed a curated starter set.
3. **Discover → recommendations** — preferences UI + filter engine.
4. **Artwork detail + size/frame selection.**
5. **AR preview** — `<model-viewer>` + photo-upload fallback.
6. **Guest order flow** — request form → Order created.
7. **Telegram dispatch + webhook** — order card w/ Accept/Ship buttons → status updates.
8. **My orders / tracking + Admin catalog/orders board.**
9. **Build/typecheck green; local run; then redeploy.**

**Needed from you later (not blocking):** a Telegram bot token (@BotFather) + painter chat id.
Until then it runs in demo mode (orders saved, Telegram send stubbed), same pattern as Supabase.
