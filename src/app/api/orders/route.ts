import { NextResponse, after } from "next/server";
import { z } from "zod";
import { isSameOrigin } from "@/lib/http";
import { rateLimit, clientIpFrom } from "@/lib/rate-limit";
import { getPainting } from "@/lib/catalog";
import {
  computePrice,
  computePriceToman,
  sizeById,
  frameById,
  usdToToman,
  tomanToUsd,
  depositOf,
} from "@/lib/config";
import { sendOfferToTelegram } from "@/lib/telegram";
import { imageOf } from "@/data/paintings";
import { prisma } from "@/lib/prisma";
import { makeRef } from "@/lib/escrow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// The offer is what the customer is willing to pay. It's bounded to sane ranges so
// a fat-fingered or hostile value can't poison the record, but it is otherwise free
// (above or below our estimate) — that's the whole point of the auction.
const bodySchema = z.object({
  paintingId: z.number().int().positive(),
  sizeId: z.enum(["S", "M", "L", "XL"]),
  frameId: z.enum(["none", "wood", "black", "white", "gold"]),
  offeredAmount: z.number().int().positive().max(2_000_000_000),
  offeredCurrency: z.enum(["usd", "toman"]),
  name: z.string().min(1).max(100),
  contact: z.string().min(3).max(120),
  address: z.string().min(4).max(300),
  note: z.string().max(500).optional(),
});

// Floors below which an "offer" is almost certainly a mistake.
const MIN_USD = 20;
const MIN_TOMAN = 500_000;

export async function POST(req: Request) {
  // CSRF defence-in-depth.
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }

  // Abuse brake (no auth required — guest checkout).
  const ip = clientIpFrom(req.headers);
  const limit = await rateLimit(`order:ip:${ip}`, 10, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { paintingId, sizeId, frameId, offeredAmount, offeredCurrency, name, contact, address, note } =
    parsed.data;

  // The catalog + pricing are the source of truth. Complexity comes from the
  // catalog (server-side), never the request.
  const painting = getPainting(paintingId);
  if (!painting) {
    return NextResponse.json({ error: "Unknown painting or options" }, { status: 400 });
  }
  const suggestedUsd = computePrice(sizeId, frameId, painting.complexity);
  const suggestedToman = computePriceToman(sizeId, frameId, painting.complexity);
  if (suggestedUsd === null || suggestedToman === null) {
    return NextResponse.json({ error: "Unknown painting or options" }, { status: 400 });
  }

  // Reject offers below the sanity floor for the chosen currency.
  if (
    (offeredCurrency === "usd" && offeredAmount < MIN_USD) ||
    (offeredCurrency === "toman" && offeredAmount < MIN_TOMAN)
  ) {
    return NextResponse.json({ error: "Offer too low" }, { status: 400 });
  }

  // Carry both currencies: the one the customer typed is authoritative, the other
  // is an indicative conversion for the Telegram card / the opposite locale.
  const offeredUsd = offeredCurrency === "usd" ? offeredAmount : tomanToUsd(offeredAmount);
  const offeredToman = offeredCurrency === "toman" ? offeredAmount : usdToToman(offeredAmount);
  const depositUsd = depositOf(offeredUsd, "usd");
  const depositToman = depositOf(offeredToman, "toman");

  const ref = makeRef();
  const imageUrl = imageOf(painting);

  // Persist if a database is reachable; otherwise continue (local/demo mode).
  let persisted = false;
  try {
    await prisma.order.create({
      data: {
        ref,
        source: "catalog",
        paintingId,
        paintingTitle: painting.title,
        artist: painting.artist,
        imageUrl,
        sizeId,
        frameId,
        suggestedUsd,
        suggestedToman,
        offeredUsd,
        offeredToman,
        offeredCurrency,
        depositUsd,
        depositToman,
        customerName: name,
        contact,
        address,
        note: note ?? null,
      },
    });
    persisted = true;
  } catch {
    persisted = false;
  }

  // Deliver to Telegram after the response is sent, so the customer reaches the
  // deposit page immediately instead of waiting on the Bot API round-trip.
  after(() =>
    sendOfferToTelegram({
      ref,
      paintingId,
      paintingTitle: painting.title,
      artist: painting.artist,
      size: sizeById(sizeId)!.id,
      frame: frameById(frameId)!.id,
      suggestedUsd,
      suggestedToman,
      offeredUsd,
      offeredToman,
      offeredCurrency,
      customerName: name,
      contact,
      address,
      note,
      imageUrl,
    })
  );

  return NextResponse.json({ ref, offeredUsd, offeredToman, persisted });
}
