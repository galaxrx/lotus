import "server-only";
import crypto from "node:crypto";

/**
 * The commission lifecycle and the rules around it. This is the spine of the
 * escrow model (docs/SYSTEM_DESIGN.md §4): the customer names a price, the owner
 * brokers it to an artist on the auction channel, a deposit paid card-to-card
 * unlocks contact between the two parties, and the owner takes 10% at delivery.
 *
 * The app never moves money — it only advances this state machine and renders the
 * instructions. Sensitive contact fields are released exactly once, when the
 * deposit is confirmed (`isContactRevealed`).
 */

export const STATUSES = [
  "offer_pending", // customer made an offer; owner is reviewing
  "channel_posted", // owner posted the anonymized offer to the auction channel
  "artist_matched", // an artist accepted; the deposit is now due
  "deposit_pending", // customer submitted a transfer code; owner is verifying
  "deposit_confirmed", // deposit received → the two parties are introduced
  "in_progress", // the canvas is being painted
  "delivered", // handed over; final balance settled
  "completed", // done; owner's 10% taken
  "cancelled", // fell through at any stage
] as const;

export type CommissionStatus = (typeof STATUSES)[number];

// Which states may follow which. `cancelled` is reachable from any live state.
const TRANSITIONS: Record<CommissionStatus, CommissionStatus[]> = {
  offer_pending: ["channel_posted", "cancelled"],
  channel_posted: ["artist_matched", "cancelled"],
  artist_matched: ["deposit_pending", "cancelled"],
  deposit_pending: ["deposit_confirmed", "artist_matched", "cancelled"], // back to matched if the transfer didn't clear
  deposit_confirmed: ["in_progress", "cancelled"],
  in_progress: ["delivered", "cancelled"],
  delivered: ["completed"],
  completed: [],
  cancelled: [],
};

export function canTransition(from: CommissionStatus, to: CommissionStatus): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

/** The anonymity gate: contact details are shared only from deposit-confirmed on. */
export function isContactRevealed(status: string): boolean {
  return (
    status === "deposit_confirmed" ||
    status === "in_progress" ||
    status === "delivered" ||
    status === "completed"
  );
}

/** True once an artist has accepted and the customer should pay the deposit. */
export function isAwaitingDeposit(status: string): boolean {
  return status === "artist_matched" || status === "deposit_pending";
}

export function isTerminal(status: string): boolean {
  return status === "completed" || status === "cancelled";
}

export function makeRef(): string {
  return `NIL-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

/** Short human-quotable code the customer writes in their bank transfer memo. */
export function makeDepositMemo(ref: string): string {
  return ref; // the ref itself doubles as the transfer memo — one number to track
}

/**
 * Constant-time comparison for the admin bearer token, so a wrong guess can't be
 * timed. Returns false if the token isn't configured (admin surface stays closed).
 */
export function adminTokenMatches(provided: string | null | undefined, expected: string | undefined): boolean {
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
