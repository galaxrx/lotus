import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

/**
 * Fixed-window rate limiter with a SHARED, ATOMIC Postgres store.
 *
 * Each (key + window) is a distinct row; the increment is a single
 * `INSERT ... ON CONFLICT DO UPDATE ... RETURNING` statement, so counters are
 * correct across serverless/multi-instance deployments (the previous in-memory
 * Map was per-instance and is retained only as a fail-open fallback if the DB is
 * transiently unavailable — see MemoryStore).
 */

export interface RateLimitStore {
  hit(key: string, windowMs: number): Promise<{ count: number; resetAt: number }>;
}

class MemoryStore implements RateLimitStore {
  private buckets = new Map<string, { count: number; resetAt: number }>();
  async hit(key: string, windowMs: number) {
    const now = Date.now();
    const existing = this.buckets.get(key);
    if (!existing || existing.resetAt <= now) {
      const fresh = { count: 1, resetAt: now + windowMs };
      this.buckets.set(key, fresh);
      return fresh;
    }
    existing.count += 1;
    return existing;
  }
}

class PostgresStore implements RateLimitStore {
  async hit(key: string, windowMs: number) {
    const now = Date.now();
    const windowStart = Math.floor(now / windowMs) * windowMs;
    const resetAt = windowStart + windowMs;
    const rowKey = `${key}:${windowStart}`;
    const windowEnd = new Date(resetAt);

    // Atomic upsert-increment. Returns the post-increment count.
    const rows = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql`
      INSERT INTO rate_limits (key, count, "windowEnd")
      VALUES (${rowKey}, 1, ${windowEnd})
      ON CONFLICT (key) DO UPDATE SET count = rate_limits.count + 1
      RETURNING count;
    `);
    return { count: rows[0]?.count ?? 1, resetAt };
  }
}

const memoryFallback = new MemoryStore();
const primary: RateLimitStore = new PostgresStore();

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  let count: number;
  let resetAt: number;
  try {
    ({ count, resetAt } = await primary.hit(key, windowMs));
  } catch {
    // DB blip — degrade to per-instance limiting rather than failing the request.
    ({ count, resetAt } = await memoryFallback.hit(key, windowMs));
  }
  return { success: count <= limit, remaining: Math.max(0, limit - count), resetAt };
}

/** Best-effort client IP from proxy headers (do not trust for authz). */
export function clientIpFrom(headers: Headers): string {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}
