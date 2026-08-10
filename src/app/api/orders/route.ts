import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { z } from "zod";
import { isSameOrigin } from "@/lib/http";
import { rateLimit, clientIpFrom } from "@/lib/rate-limit";
import { getPainting } from "@/lib/catalog";
import { computePrice, sizeById, frameById } from "@/lib/config";
import { sendOrderToTelegram } from "@/lib/telegram";
import { metImage } from "@/data/paintings";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  paintingId: z.number().int().positive(),
  sizeId: z.enum(["S", "M", "L", "XL"]),
  frameId: z.enum(["none", "wood", "black", "white"]),
  name: z.string().min(1).max(100),
  contact: z.string().min(3).max(120),
  address: z.string().min(4).max(300),
  note: z.string().max(500).optional(),
});

function makeRef(): string {
  return `LOT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

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
  const { paintingId, sizeId, frameId, name, contact, address, note } = parsed.data;

  // The catalog + pricing are the source of truth — never trust a client price.
  const painting = getPainting(paintingId);
  const price = computePrice(sizeId, frameId);
  if (!painting || price === null) {
    return NextResponse.json({ error: "Unknown painting or options" }, { status: 400 });
  }

  const ref = makeRef();

  // Persist if a database is reachable; otherwise continue (local/demo mode).
  let persisted = false;
  try {
    await prisma.order.create({
      data: {
        ref,
        paintingId,
        paintingTitle: painting.title,
        artist: painting.artist,
        sizeId,
        frameId,
        priceUsd: price,
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

  const delivery = await sendOrderToTelegram({
    ref,
    paintingTitle: painting.title,
    artist: painting.artist,
    size: sizeById(sizeId)!.id,
    frame: frameById(frameId)!.id,
    priceUsd: price,
    customerName: name,
    contact,
    address,
    note,
    imageUrl: metImage(painting.file),
  });

  return NextResponse.json({ ref, priceUsd: price, persisted, delivery });
}
