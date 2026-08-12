import "server-only";
import { serverEnv, publicEnv } from "@/lib/env";
import { formatToman, formatUsd } from "@/lib/config";

export interface OfferNotification {
  ref: string;
  paintingId: number;
  paintingTitle: string;
  artist: string;
  size: string;
  frame: string;
  suggestedUsd: number;
  suggestedToman: number;
  offeredUsd: number;
  offeredToman: number;
  offeredCurrency: "usd" | "toman";
  customerName: string;
  contact: string;
  address: string;
  note?: string;
  imageUrl: string;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Raw Bot API call. Returns the parsed body's `ok`, or false on any failure. */
async function tg(method: string, body: Record<string, unknown>): Promise<boolean> {
  const token = serverEnv.telegramBotToken;
  if (!token) return false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return true;
    const detail = await res.text().catch(() => "");
    console.error(`[telegram] ${method} failed (${res.status}): ${detail.slice(0, 300)}`);
    return false;
  } catch (err) {
    console.error(`[telegram] ${method} threw:`, err);
    return false;
  }
}

/**
 * Send an image card: try sendPhoto (photo + HTML caption), and if Telegram can't
 * fetch the image or the caption is too long, fall back to a text message that
 * still carries the link. `caption` is HTML.
 */
async function sendCard(chatId: string, photo: string, caption: string): Promise<boolean> {
  const asPhoto = await tg("sendPhoto", { chat_id: chatId, photo, caption, parse_mode: "HTML" });
  if (asPhoto) return true;
  return tg("sendMessage", {
    chat_id: chatId,
    text: caption,
    parse_mode: "HTML",
    disable_web_page_preview: false,
  });
}

/**
 * Deliver a new commission request to the owner as two image cards: a private one
 * with the client's details, and a clean, forward-ready one with no client details
 * for the public auction channel. Both carry the painting's photo and a link to it
 * (docs/SYSTEM_DESIGN.md §3).
 */
export async function sendOfferToTelegram(o: OfferNotification): Promise<"sent" | "stubbed" | "failed"> {
  const token = serverEnv.telegramBotToken;
  const chatId = serverEnv.telegramChatId;
  if (!token || !chatId) {
    console.warn(
      "[telegram] Not configured, skipping dispatch. " +
        `TELEGRAM_BOT_TOKEN set: ${Boolean(token)}, TELEGRAM_CHAT_ID set: ${Boolean(chatId)}`
    );
    return "stubbed";
  }

  const both = (usd: number, toman: number) => `${formatUsd(usd)} · ${formatToman(toman)}`;
  const base = publicEnv.appUrl.replace(/\/$/, "");
  const link = `${base}/art/${o.paintingId}`;
  const channel = serverEnv.telegramChannel ?? "";
  const piece = `<b>${escapeHtml(o.paintingTitle)}</b> — after ${escapeHtml(o.artist)}`;
  const spec = `Size ${escapeHtml(o.size)} · ${escapeHtml(o.frame)} frame`;
  const openLink = `🔗 <a href="${escapeHtml(link)}">Open the painting</a>`;

  // Private card — owner only.
  const ownerCaption = [
    "🎨 <b>New commission request</b>",
    `Ref: ${escapeHtml(o.ref)}`,
    "",
    piece,
    spec,
    `💎 <b>Commission:</b> ${escapeHtml(both(o.offeredUsd, o.offeredToman))}`,
    `<i>Guide price: ${escapeHtml(both(o.suggestedUsd, o.suggestedToman))}</i>`,
    "",
    "👤 <b>Client — private</b>",
    `Name: ${escapeHtml(o.customerName)}`,
    `Contact: ${escapeHtml(o.contact)}`,
    `Deliver to: ${escapeHtml(o.address)}`,
    o.note ? `Note: ${escapeHtml(o.note.slice(0, 300))}` : "",
    "",
    openLink,
  ].filter(Boolean).join("\n");

  const ownerOk = await sendCard(chatId, o.imageUrl, ownerCaption);

  // Anonymized auction card — posted straight to the public channel when one is
  // configured (and it isn't just the owner's own chat). Without a channel we send
  // nothing extra, so the owner gets exactly one message per order, not two.
  if (channel && channel !== chatId) {
    const channelCaption = [
      "🖼 <b>Commission up for auction</b>",
      piece,
      spec,
      `💎 <b>Commission:</b> ${escapeHtml(both(o.offeredUsd, o.offeredToman))}`,
      `Ref ${escapeHtml(o.ref)} — reply to take it on.`,
      openLink,
    ].join("\n");
    await sendCard(channel, o.imageUrl, channelCaption); // best-effort
  }
  return ownerOk ? "sent" : "failed";
}

export interface PurchaseNotification {
  ref: string;
  artworkTitle: string;
  artistName: string;
  priceUsd: number;
  priceToman: number;
  customerName: string;
  contact: string;
  address: string;
  note?: string;
  imageUrl: string;
  link: string; // public URL of the artist's studio / artwork
}

/**
 * A direct purchase of an artist's original work. Unlike a catalog commission this
 * isn't an auction — the artist is already known — so there's no channel post. The
 * owner gets one private card with the artwork photo, a link, and the buyer's details.
 */
export async function sendPurchaseToTelegram(o: PurchaseNotification): Promise<"sent" | "stubbed" | "failed"> {
  const token = serverEnv.telegramBotToken;
  const chatId = serverEnv.telegramChatId;
  if (!token || !chatId) return "stubbed";

  const caption = [
    "🛒 <b>New purchase</b>",
    `Ref: ${escapeHtml(o.ref)}`,
    "",
    `<b>${escapeHtml(o.artworkTitle)}</b> — by ${escapeHtml(o.artistName)}`,
    `💎 <b>Price:</b> ${escapeHtml(`${formatUsd(o.priceUsd)} · ${formatToman(o.priceToman)}`)}`,
    "",
    "👤 <b>Buyer — private</b>",
    `Name: ${escapeHtml(o.customerName)}`,
    `Contact: ${escapeHtml(o.contact)}`,
    `Deliver to: ${escapeHtml(o.address)}`,
    o.note ? `Note: ${escapeHtml(o.note.slice(0, 300))}` : "",
    "",
    `🔗 <a href="${escapeHtml(o.link)}">Open the artist's studio</a>`,
    "Take a deposit, then introduce the buyer and the artist.",
  ].filter(Boolean).join("\n");

  return (await sendCard(chatId, o.imageUrl, caption)) ? "sent" : "failed";
}

/** Plain owner notification for escrow lifecycle events (deposit confirmed, etc.). */
export async function notifyOwner(text: string): Promise<"sent" | "stubbed" | "failed"> {
  const token = serverEnv.telegramBotToken;
  const chatId = serverEnv.telegramChatId;
  if (!token || !chatId) return "stubbed";
  return (await tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }))
    ? "sent"
    : "failed";
}
