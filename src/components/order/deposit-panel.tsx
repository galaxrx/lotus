"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Loader2, ShieldCheck } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { Button } from "@/components/ui/button";

export interface OwnerPayInfo {
  card: string | null;
  holder: string | null;
  sheba: string | null;
}

/**
 * Shown once a painter has accepted. Renders the card-to-card transfer target and
 * takes the customer's bank tracking code, moving the commission to deposit_pending.
 * No money flows through the app — this only records the code for the owner to verify.
 */
export function DepositPanel({
  reference,
  depositLabel,
  balanceLabel,
  pay,
  submittedCode,
  configured,
}: {
  reference: string;
  depositLabel: string;
  balanceLabel: string;
  pay: OwnerPayInfo;
  submittedCode: string | null;
  configured: boolean;
}) {
  const { dict } = useI18n();
  const d = dict.deposit;
  const router = useRouter();
  const [code, setCode] = useState(submittedCode ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(value: string, key: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied((k) => (k === key ? null : k)), 1500);
    } catch {
      /* clipboard blocked — the value is visible to copy by hand */
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/commissions/${reference}/deposit`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) setError(data?.error ?? d.error);
      else router.refresh();
    } catch {
      setError(d.error);
    } finally {
      setLoading(false);
    }
  }

  const Row = ({ label, value, k }: { label: string; value: string; k: string }) => (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm tabular-nums">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => copy(value, k)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs text-muted-foreground hover:bg-muted cursor-pointer"
      >
        {copied === k ? <Check size={13} /> : <Copy size={13} />}
        {copied === k ? d.copied : d.copy}
      </button>
    </div>
  );

  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-muted-foreground">{d.depositLabel}</span>
        <span className="font-serif text-2xl">{depositLabel}</span>
      </div>
      <div className="mt-1 flex items-baseline justify-between gap-4 text-sm text-muted-foreground">
        <span>{d.balanceLabel}</span>
        <span>{balanceLabel}</span>
      </div>

      {configured ? (
        <>
          <div className="mt-5 border-t border-border pt-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {d.payToTitle}
            </p>
            <div className="mt-1 divide-y divide-border">
              {pay.card && <Row label={d.cardLabel} value={pay.card} k="card" />}
              {pay.holder && <Row label={d.holderLabel} value={pay.holder} k="holder" />}
              {pay.sheba && <Row label={d.shebaLabel} value={pay.sheba} k="sheba" />}
              <Row label={d.memoLabel} value={reference} k="memo" />
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-5 space-y-2 border-t border-border pt-4">
            <label htmlFor="code" className="text-sm font-medium">
              {d.codeLabel}
            </label>
            <input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              minLength={4}
              className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
            <p className="text-xs text-muted-foreground">{d.codeHint}</p>
            {error && (
              <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              {loading ? d.submitting : d.submitDeposit}
            </Button>
          </form>
        </>
      ) : (
        <p className="mt-5 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
          {d.notConfigured}
        </p>
      )}
    </div>
  );
}
