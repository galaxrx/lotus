import "server-only";
import { serverEnv } from "@/lib/env";

export interface OrderNotification {
  ref: string;
  paintingTitle: string;
  artist: string;
  size: string;
  frame: string;
  priceUsd: number;
  customerName: string;
  contact: string;
  address: string;
  note?: string;
  imageUrl: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Send a new-order card to the painter's Telegram chat via the Bot API.
 * Returns "sent" | "stubbed" | "failed". When the bot token / chat id are not
 * configured (local/demo), it is a no-op ("stubbed") so the flow still works.
 * api.telegram.org is a trusted first-party endpoint (not a user-supplied URL),
 * so it does not go through the SSRF guard.
 */
export async function sendOrderToTelegram(
  order: OrderNotification
): Promise<"sent" | "stubbed" | "failed"> {
  const token = serverEnv.telegramBotToken;
  const chatId = serverEnv.telegramChatId;
  if (!token || !chatId) return "stubbed";

  const lines = [
    "🖼️ <b>New painting request</b>",
    `<b>Ref:</b> ${escapeHtml(order.ref)}`,
    "",
    `<b>${escapeHtml(order.paintingTitle)}</b> — ${escapeHtml(order.artist)}`,
    `Size: ${escapeHtml(order.size)} · Frame: ${escapeHtml(order.frame)}`,
    `Indicative price: $${order.priceUsd}`,
    "",
    `<b>Customer:</b> ${escapeHtml(order.customerName)}`,
    `<b>Contact:</b> ${escapeHtml(order.contact)}`,
    `<b>Deliver to:</b> ${escapeHtml(order.address)}`,
    order.note ? `<b>Note:</b> ${escapeHtml(order.note)}` : "",
  ].filter(Boolean);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "HTML",
        disable_web_page_preview: false,
      }),
    });
    return res.ok ? "sent" : "failed";
  } catch {
    return "failed";
  }
}
