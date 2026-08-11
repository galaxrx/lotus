import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/lib/env";
import { adminTokenMatches } from "@/lib/escrow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearer(req: Request): string | null {
  const h = req.headers.get("authorization") ?? "";
  return h.startsWith("Bearer ") ? h.slice(7) : null;
}

// Owner-only listing of every commission, most recent first. Guarded by a
// constant-time token compare; without ADMIN_TOKEN configured, it stays shut.
export async function GET(req: Request) {
  if (!adminTokenMatches(bearer(req), serverEnv.adminToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
