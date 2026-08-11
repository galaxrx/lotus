import { NextResponse } from "next/server";
import { z } from "zod";
import { isSameOrigin } from "@/lib/http";
import { rateLimit, clientIpFrom } from "@/lib/rate-limit";
import { prisma } from "@/lib/prisma";
import { canTransition, type CommissionStatus } from "@/lib/escrow";
import { notifyOwner } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({ code: z.string().trim().min(4).max(60) });

// The customer, having paid the deposit card-to-card, submits the bank's tracking
// code. This moves the commission to `deposit_pending`; the owner verifies the
// transfer and confirms it from the admin dashboard (that's the reveal gate).
export async function POST(req: Request, { params }: { params: Promise<{ ref: string }> }) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  const ip = clientIpFrom(req.headers);
  const limit = await rateLimit(`deposit:ip:${ip}`, 10, 60_000);
  if (!limit.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { ref } = await params;
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  let order;
  try {
    order = await prisma.order.findUnique({ where: { ref } });
  } catch {
    return NextResponse.json({ error: "Unavailable" }, { status: 503 });
  }
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const from = order.status as CommissionStatus;
  // Allow first submission (artist_matched → deposit_pending) or re-submission of a
  // corrected code while still pending.
  if (from !== "artist_matched" && from !== "deposit_pending") {
    return NextResponse.json({ error: "Not awaiting a deposit" }, { status: 409 });
  }
  if (from === "artist_matched" && !canTransition(from, "deposit_pending")) {
    return NextResponse.json({ error: "Invalid state" }, { status: 409 });
  }

  await prisma.order.update({
    where: { ref },
    data: { status: "deposit_pending", depositTrackingCode: parsed.data.code },
  });

  await notifyOwner(
    `💳 Deposit code submitted for <b>${ref}</b>\nCode: <code>${parsed.data.code}</code>\nVerify the transfer, then confirm it in the admin dashboard to introduce the two parties.`
  );

  return NextResponse.json({ ok: true, status: "deposit_pending" });
}
