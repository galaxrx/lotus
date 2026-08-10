import { PrismaClient } from "@prisma/client";

/**
 * Prisma connects directly to Postgres and therefore executes as the database
 * owner — it BYPASSES Supabase Row Level Security. Every Prisma query in this
 * codebase must enforce tenant/ownership scoping in application code (see
 * `src/lib/authz.ts`). RLS is the second line of defence for paths that use the
 * Supabase client with the user's JWT, not for Prisma.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
