import { NextResponse, after } from "next/server";
import { z } from "zod";
import { isSameOrigin } from "@/lib/http";
import { rateLimit, clientIpFrom } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { publicEnv } from "@/lib/env";
import { usdToToman, tomanToUsd, depositOf } from "@/lib/config";
import { makeRef } from "@/lib/escrow";
import { sendPurchaseToTelegram } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  currency: z.enum(["usd", "toman"]),
  name: z.string().min(1).max(100),
  contact: z.string().min(3).max(120),
  address: z.string().min(4).max(300),
  note: z.string().max(500).optional(),
});

// Buy an artist's original work. The artist is already known, so the commission
// skips the auction and starts at `artist_matched` — the buyer pays a deposit and
// the owner introduces the two, reusing the same escrow flow as a catalog piece.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(req)) return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  const ip = clientIpFrom(req.headers);
  const limit = await rateLimit(`buy:ip:${ip}`, 10, 60_000);
  if (!limit.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  if (!supabaseConfigured()) return NextResponse.json({ error: "Unavailable" }, { status: 503 });

  const { id } = await params;
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { currency, name, contact, address, note } = parsed.data;

  // Read the published artwork + its artist (RLS allows published rows).
  const supabase = await createClient();
  const { data: art } = await supabase
    .from("artworks")
    .select("id, title_en, title_fa, image_url, price_toman, price_usd, for_sale, artist:artist_profiles!inner(display_name, handle)")
    .eq("id", id)
    .eq("published", true)
    .maybeSingle();
  if (!art || !art.for_sale) return NextResponse.json({ error: "Not available" }, { status: 400 });

  // Resolve a price in both currencies; a piece with no price can't be bought online.
  const priceToman = art.price_toman ?? (art.price_usd != null ? usdToToman(art.price_usd) : null);
  const priceUsd = art.price_usd ?? (art.price_toman != null ? tomanToUsd(art.price_toman) : null);
  if (priceToman == null || priceUsd == null) {
    return NextResponse.json({ error: "Price on request" }, { status: 400 });
  }

  const artist = (art.artist as unknown as { display_name: string; handle: string });
  const title = art.title_en || art.title_fa || "Untitled";
  const ref = makeRef();

  let persisted = false;
  try {
    await prisma.order.create({
      data: {
        ref,
        source: "artist",
        paintingId: 0,
        paintingTitle: title,
        artist: artist.display_name,
        artworkId: id,
        imageUrl: art.image_url,
        sizeId: "original",
        frameId: "none",
        suggestedUsd: priceUsd,
        suggestedToman: priceToman,
        offeredUsd: priceUsd,
        offeredToman: priceToman,
        offeredCurrency: currency,
        depositUsd: depositOf(priceUsd, "usd"),
        depositToman: depositOf(priceToman, "toman"),
        customerName: name,
        contact,
        address,
        note: note ?? null,
        status: "artist_matched",
      },
    });
    persisted = true;
  } catch {
    persisted = false;
  }

  // Notify the owner after responding, so the buyer lands on the deposit step
  // immediately rather than waiting on the Telegram round-trip.
  after(() =>
    sendPurchaseToTelegram({
      ref,
      artworkTitle: title,
      artistName: artist.display_name,
      priceUsd,
      priceToman,
      customerName: name,
      contact,
      address,
      note,
      imageUrl: art.image_url,
      link: `${publicEnv.appUrl.replace(/\/$/, "")}/ateliers/${artist.handle}`,
    })
  );

  return NextResponse.json({ ref, persisted });
}
