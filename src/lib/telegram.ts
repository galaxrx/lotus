import "server-only";
import { serverEnv } from "@/lib/env";
import { formatToman } from "@/lib/config";

export interface OrderNotification {
  ref: string;
  paintingTitle: string;
  artist: string;
  size: string;
  frame: string;
  priceUsd: number;
  priceToman: number;
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
  if (!token || !chatId) {
    console.warn(
      "[telegram] Not configured, skipping dispatch. " +
        `TELEGRAM_BOT_TOKEN set: ${Boolean(token)}, TELEGRAM_CHAT_ID set: ${Boolean(chatId)}`
    );
    return "stubbed";
  }

  const lines = [
    "🖼️ <b>New painting request</b>",
    `<b>Ref:</b> ${escapeHtml(order.ref)}`,
    "",
    `<b>${escapeHtml(order.paintingTitle)}</b> — ${escapeHtml(order.artist)}`,
    `Size: ${escapeHtml(order.size)} · Frame: ${escapeHtml(order.frame)}`,
    `Indicative price: $${order.priceUsd} · ${escapeHtml(formatToman(order.priceToman))}`,
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
    if (res.ok) return "sent";
    // Telegram explains refusals in the body ("chat not found", "bot was
    // blocked", "unauthorized"). Surface it in the server log — without the
    // token — so a misconfigured bot is diagnosable from the deployment logs.
    const detail = await res.text().catch(() => "");
    console.error(`[telegram] sendMessage failed (${res.status}): ${detail.slice(0, 300)}`);
    return "failed";
  } catch (err) {
    console.error("[telegram] sendMessage threw:", err);
    return "failed";
  }
}
