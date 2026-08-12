import Link from "next/link";
import { Check, Clock, ShieldCheck, Palette, PackageCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buttonClasses } from "@/components/ui/button";
import { NiloosaMark } from "@/components/brand/logo";
import { DepositPanel } from "@/components/order/deposit-panel";
import { getI18n } from "@/i18n/server";
import { prisma } from "@/lib/prisma";
import { serverEnv } from "@/lib/env";
import { formatMoney } from "@/lib/config";
import { isAwaitingDeposit, isContactRevealed, type CommissionStatus } from "@/lib/escrow";
import { cn } from "@/lib/utils";

export const metadata = { title: "Your commission" };
export const dynamic = "force-dynamic";

// A compact, human timeline. We collapse the nine internal states into five stops
// the customer actually cares about.
const STOPS: { icon: typeof Check; reaches: CommissionStatus[] }[] = [
  { icon: Check, reaches: ["offer_pending", "channel_posted"] },
  { icon: Palette, reaches: ["artist_matched", "deposit_pending"] },
  { icon: ShieldCheck, reaches: ["deposit_confirmed", "in_progress"] },
  { icon: PackageCheck, reaches: ["delivered"] },
  { icon: Check, reaches: ["completed"] },
];

export default async function CommissionPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const { locale, dict } = await getI18n();
  const o = dict.order;
  const d = dict.deposit;
  const s = dict.status;
  const currency: "usd" | "toman" = locale === "fa" ? "toman" : "usd";

  let order: Awaited<ReturnType<typeof prisma.order.findUnique>> = null;
  try {
    order = await prisma.order.findUnique({ where: { ref } });
  } catch {
    order = null;
  }

  // Demo / not-persisted: keep the simple "offer sent" confirmation.
  if (!order) {
    return (
      <>
        <SiteHeader />
        <main id="main" className="grid min-h-[70dvh] place-items-center px-6 py-20">
          <div className="w-full max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Check size={30} />
            </div>
            <h1 className="mt-6 text-3xl">{o.successTitle}</h1>
            <p className="mt-3 text-pretty text-muted-foreground">{o.successBody}</p>
            <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{o.ref}</p>
              <p className="mt-1 font-mono text-2xl font-semibold tracking-wide text-foreground">{ref}</p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{o.keepNote}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/" className={buttonClasses("secondary", "md")}>{o.backHome}</Link>
              <Link href="/discover" className={buttonClasses("primary", "md")}>{o.browse}</Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const status = order.status as CommissionStatus;
  const offered = currency === "toman" ? order.offeredToman : order.offeredUsd;
  const deposit = currency === "toman" ? order.depositToman : order.depositUsd;
  const balance = Math.max(0, offered - deposit);
  const activeStop = STOPS.findIndex((st) => st.reaches.includes(status));
  const awaiting = isAwaitingDeposit(status);
  const revealed = isContactRevealed(status);
  const cancelled = status === "cancelled";

  const bodyByStatus: Record<string, string> = {
    offer_pending: o.successBody,
    channel_posted: o.successBody,
    artist_matched: d.awaitingBody,
    deposit_pending: d.pendingBody,
    deposit_confirmed: d.revealedBody,
    in_progress: d.progressBody,
    delivered: d.deliveredBody,
    completed: d.completedBody,
    cancelled: d.cancelledBody,
  };

  const payConfigured = Boolean(serverEnv.ownerCardNumber || serverEnv.ownerSheba);

  return (
    <>
      <SiteHeader />
      <main id="main" className="container-page max-w-2xl py-12 md:py-16">
        <p className="eyebrow">{d.trackTitle}</p>
        {/* Piece + offer */}
        <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-surface p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={order.imageUrl} alt="" className="h-20 w-16 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl">{order.paintingTitle}</h1>
            <p className="truncate text-sm text-muted-foreground">
              {dict.common.by} {order.artist}
            </p>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{order.ref}</p>
          </div>
          <div className="text-end">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{d.offerLabel}</p>
            <p className="font-serif text-lg">{formatMoney(offered, currency)}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{o.keepNote}</p>

        {/* Status */}
        <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{d.statusLabel}</span>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium",
                cancelled ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
              )}
            >
              {s[status]}
            </span>
          </div>

          {!cancelled && (
            <ol className="mt-6 flex items-center">
              {STOPS.map((st, i) => {
                const Icon = st.icon;
                const done = i <= activeStop;
                return (
                  <li key={i} className="flex flex-1 items-center last:flex-none">
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors",
                        done
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground"
                      )}
                    >
                      {done ? <Icon size={16} /> : <Clock size={15} />}
                    </span>
                    {i < STOPS.length - 1 && (
                      <span className={cn("h-0.5 flex-1", i < activeStop ? "bg-primary" : "bg-border")} />
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          <p className="mt-5 text-pretty leading-relaxed text-muted-foreground">{bodyByStatus[status]}</p>
        </div>

        {/* Deposit step */}
        {awaiting && (
          <div className="mt-6">
            <h2 className="text-lg">{d.awaitingTitle}</h2>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">{d.anonNote}</p>
            <DepositPanel
              reference={order.ref}
              depositLabel={formatMoney(deposit, currency)}
              balanceLabel={formatMoney(balance, currency)}
              pay={{
                card: serverEnv.ownerCardNumber ?? null,
                holder: serverEnv.ownerCardHolder ?? null,
                sheba: serverEnv.ownerSheba ?? null,
              }}
              submittedCode={order.depositTrackingCode}
              configured={payConfigured}
            />
          </div>
        )}

        {/* Reveal */}
        {revealed && (
          <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck size={18} />
              <h2 className="text-lg text-foreground">{d.revealedTitle}</h2>
            </div>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{bodyByStatus[status]}</p>
          </div>
        )}

        {/* How it works */}
        <div className="mt-8 rounded-2xl border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{d.howTitle}</p>
          <ol className="mt-3 space-y-2">
            {d.howSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-medium text-foreground">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonClasses("secondary", "md")}>{o.backHome}</Link>
          <Link href="/discover" className={buttonClasses("primary", "md")}>{o.browse}</Link>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-muted-foreground">
          <NiloosaMark tone="brand" className="h-5 w-5" />
          <span className="font-serif italic">Niloosa</span>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
