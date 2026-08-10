# Lotus

**Hand-painted masterpieces for your wall.** Choose a real public-domain painting,
preview it on your wall in AR, and a painter reproduces it on canvas — real
texture, real signature. Requests are sent to the painter on Telegram.

Bilingual (English + Persian, full RTL), light/dark, editorial-luxury botanical design.

## Tech stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS (design tokens as CSS variables) · shadcn-style `components/ui`
- Prisma → Postgres (order persistence)
- The Met Open Access API (public-domain artwork catalog)
- Telegram Bot API (order delivery)

## Local development

```bash
npm install
cp .env.example .env      # fill in values (or leave blank for demo mode)
npx prisma generate
npm run dev               # http://localhost:3000
```

With no `DATABASE_URL`/Telegram configured, the app runs in **demo mode**: orders
aren't persisted and Telegram delivery is stubbed, but the whole flow works.

### Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | Next.js lint |

## Environment

See [`.env.example`](./.env.example):

- `NEXT_PUBLIC_APP_URL` — public site URL (metadata, sitemap, OG)
- `DATABASE_URL` / `DIRECT_URL` — Postgres (Neon, Supabase, etc.) to persist orders
- `TELEGRAM_BOT_TOKEN` / `TELEGRAM_CHAT_ID` — where order requests are delivered

## Deploy (Vercel + git)

1. Push this repo to GitHub.
2. Import it in Vercel (framework auto-detected as Next.js).
3. Set the env vars above in Vercel → Project → Settings → Environment Variables.
4. Point the database schema at your Postgres: `npx prisma db push` (with `DATABASE_URL` set).
5. Deploy. Future changes deploy on `git push`.

## Routes

`/` landing · `/discover` filter & browse · `/art/[id]` detail + AR preview + order ·
`/gallery` immersive collection · `/orders/[ref]` confirmation · `/contact` `/privacy`
`/terms` · `POST /api/orders`.

## Notes

- Artworks are sourced from open-access museum collections (public domain) — legal to
  reproduce. See `src/data/paintings.ts`.
- Engineering & security notes: [`CLAUDE.md`](./CLAUDE.md).
