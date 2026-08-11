import "server-only";
import { serverEnv } from "@/lib/env";
import { formatToman, formatUsd } from "@/lib/config";

export interface OfferNotification {
  ref: string;
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

/** Low-level bot send. Returns whether it went out; logs (without the token) on failure. */
async function sendMessage(text: string): Promise<"sent" | "stubbed" | "failed"> {
  const token = serverEnv.telegramBotToken;
  const chatId = serverEnv.telegramChatId;
  if (!token || !chatId) {
    console.warn(
      "[telegram] Not configured, skipping dispatch. " +
        `TELEGRAM_BOT_TOKEN set: ${Boolean(token)}, TELEGRAM_CHAT_ID set: ${Boolean(chatId)}`
    );
    return "stubbed";
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });
    if (res.ok) return "sent";
    const detail = await res.text().catch(() => "");
    console.error(`[telegram] sendMessage failed (${res.status}): ${detail.slice(0, 300)}`);
    return "failed";
  } catch (err) {
    console.error("[telegram] sendMessage threw:", err);
    return "failed";
  }
}

/**
 * Deliver a new offer privately to the owner. The message carries the full offer
 * WITH customer details, plus a ready-to-forward <pre> block that carries NO
 * customer details — the owner posts that block to the public auction channel so
 * artists can bid without ever seeing who the buyer is (docs/SYSTEM_DESIGN.md §3).
 */
export async function sendOfferToTelegram(
  o: OfferNotification
): Promise<"sent" | "stubbed" | "failed"> {
  const both = (usd: number, toman: number) => `${formatUsd(usd)} · ${formatToman(toman)}`;
  const typed = o.offeredCurrency === "toman" ? formatToman(o.offeredToman) : formatUsd(o.offeredUsd);
  const channel = serverEnv.telegramChannel ?? "";

  // Private half — owner eyes only.
  const owner = [
    "🎨 <b>New offer</b>",
    `<b>Ref:</b> ${escapeHtml(o.ref)}`,
    "",
    `<b>${escapeHtml(o.paintingTitle)}</b> — after ${escapeHtml(o.artist)}`,
    `Size ${escapeHtml(o.size)} · Frame ${escapeHtml(o.frame)}`,
    `💰 <b>Offer:</b> ${escapeHtml(both(o.offeredUsd, o.offeredToman))}  <i>(typed: ${escapeHtml(typed)})</i>`,
    `Our estimate: ${escapeHtml(both(o.suggestedUsd, o.suggestedToman))}`,
    "",
    "👤 <b>Customer — private</b>",
    `Name: ${escapeHtml(o.customerName)}`,
    `Contact: ${escapeHtml(o.contact)}`,
    `Deliver to: ${escapeHtml(o.address)}`,
    o.note ? `Note: ${escapeHtml(o.note)}` : "",
  ].filter(Boolean);

  // Public half — copy/forward this to the channel. No customer info.
  const post = [
    `🖼 ${o.paintingTitle} — after ${o.artist}`,
    `Size ${o.size} · ${o.frame} frame`,
    `Buyer's offer: ${formatToman(o.offeredToman)}  (${formatUsd(o.offeredUsd)})`,
    `Ref ${o.ref} — reply to take this commission`,
  ].join("\n");

  const text = [
    owner.join("\n"),
    "",
    `📣 <b>Post to channel${channel ? ` ${escapeHtml(channel)}` : ""}</b> (no customer details):`,
    `<pre>${escapeHtml(post)}</pre>`,
  ].join("\n");

  return sendMessage(text);
}

/** Plain owner notification for escrow lifecycle events (deposit confirmed, etc.). */
export async function notifyOwner(text: string): Promise<"sent" | "stubbed" | "failed"> {
  return sendMessage(text);
}
