import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/lib/env";
import { adminTokenMatches, canTransition, STATUSES, type CommissionStatus } from "@/lib/escrow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization") ?? "";
  return h.startsWith("Bearer ") ? h.slice(7) : null;
}

const bodySchema = z.object({
  to: z.enum(STATUSES),
  matchedArtistId: z.string().uuid().optional(),
});

// Owner-driven state transition for a commission. Validates the move against the
// allowed-transition map and stamps the relevant lifecycle timestamp.
export async function POST(req: Request, { params }: { params: Promise<{ ref: string }> }) {
  if (!adminTokenMatches(bearer(req), serverEnv.adminToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { ref } = await params;
  const json = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const { to, matchedArtistId } = parsed.data;

  let order;
  try {
    order = await prisma.order.findUnique({ where: { ref } });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const from = order.status as CommissionStatus;
  if (!canTransition(from, to)) {
    return NextResponse.json({ error: `Cannot move ${from} → ${to}` }, { status: 409 });
  }

  const now = new Date();
  const stamp: Record<string, Date> = {};
  if (to === "channel_posted") stamp.channelPostedAt = now;
  if (to === "deposit_confirmed") stamp.depositConfirmedAt = now;
  if (to === "delivered") stamp.deliveredAt = now;
  if (to === "completed") stamp.completedAt = now;

  const updated = await prisma.order.update({
    where: { ref },
    data: { status: to, ...stamp, ...(matchedArtistId ? { matchedArtistId } : {}) },
  });

  return NextResponse.json({ ok: true, order: updated });
}
