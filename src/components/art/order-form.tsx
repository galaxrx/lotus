"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Send } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { Button } from "@/components/ui/button";
import { computePrice, computePriceToman, formatMoney } from "@/lib/config";
import type { ArtDetailData } from "@/components/art/art-detail";

const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const toFaDigits = (s: string) => s.replace(/\d/g, (d) => FA_DIGITS[Number(d)]);
const toEnDigits = (s: string) => s.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)));

export function OrderForm({
  painting,
  sizeId,
  frameId,
  sizeLabel,
  frameLabel,
  complexityId,
  complexityLabel,
  onClose,
}: {
  painting: ArtDetailData;
  sizeId: string;
  frameId: string;
  sizeLabel: string;
  frameLabel: string;
  complexityId: string;
  complexityLabel: string;
  onClose: () => void;
}) {
  const { dict, locale } = useI18n();
  const o = dict.order;
  const router = useRouter();

  const currency: "usd" | "toman" = locale === "fa" ? "toman" : "usd";
  const suggested = useMemo(
    () =>
      (currency === "toman"
        ? computePriceToman(sizeId, frameId, complexityId)
        : computePrice(sizeId, frameId, complexityId)) ?? 0,
    [currency, sizeId, frameId, complexityId]
  );

  // The offer starts at our estimate; the customer can move it up or down.
  const [offer, setOffer] = useState<number>(suggested);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const low = offer > 0 && offer < suggested * 0.6;
  const step = currency === "toman" ? 500_000 : 10;

  function displayOffer(v: number): string {
    const grouped = v.toLocaleString("en-US");
    return currency === "toman" ? toFaDigits(grouped) : grouped;
  }

  function parseOffer(raw: string): number {
    const digits = toEnDigits(raw).replace(/[^\d]/g, "");
    return digits ? parseInt(digits, 10) : 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return; // guard against a double submit creating two orders
    setError(null);
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          paintingId: painting.id,
          sizeId,
          frameId,
          offeredAmount: offer,
          offeredCurrency: currency,
          name: String(form.get("name") ?? ""),
          contact: String(form.get("contact") ?? ""),
          address: String(form.get("address") ?? ""),
          note: String(form.get("note") ?? "") || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? o.error);
        setLoading(false);
      } else {
        // Keep the spinner running through navigation so the buyer never sees an
        // idle form; the modal unmounts once the confirmation page renders.
        router.push(`/orders/${data.ref}`);
      }
    } catch {
      setError(o.error);
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6">
      <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-background p-6 shadow-lift sm:rounded-3xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl">{o.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{o.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            aria-label={o.cancel}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={painting.imageUrl} alt="" className="h-16 w-14 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{painting.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {sizeLabel} · {frameLabel} · {complexityLabel}
            </p>
          </div>
          <div className="text-end">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{o.estimate}</p>
            <span className="font-serif text-lg">{formatMoney(suggested, currency)}</span>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {/* Offer */}
          <div className="space-y-1.5">
            <label htmlFor="offer" className="text-sm font-medium">
              {o.offerLabel}
            </label>
            <div className="flex items-stretch overflow-hidden rounded-xl border border-border bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
              <button
                type="button"
                aria-label="-"
                onClick={() => setOffer((v) => Math.max(0, v - step))}
                className="w-11 shrink-0 text-lg text-muted-foreground hover:bg-muted cursor-pointer"
              >
                −
              </button>
              <input
                id="offer"
                inputMode="numeric"
                autoComplete="off"
                value={displayOffer(offer)}
                onChange={(e) => setOffer(parseOffer(e.target.value))}
                className="min-w-0 flex-1 border-x border-border bg-transparent px-3 text-center text-lg font-medium tabular-nums outline-none"
              />
              <button
                type="button"
                aria-label="+"
                onClick={() => setOffer((v) => v + step)}
                className="w-11 shrink-0 text-lg text-muted-foreground hover:bg-muted cursor-pointer"
              >
                +
              </button>
              <span className="flex items-center whitespace-nowrap px-3 text-sm text-muted-foreground">
                {currency === "toman" ? "تومان" : "USD"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{o.offerHint}</p>
            {low && (
              <p className="text-xs text-gold">{o.lowOfferWarn}</p>
            )}
          </div>

          <Field name="name" label={o.name} autoComplete="name" required />
          <Field name="contact" label={o.contact} hint={o.contactHint} autoComplete="email" required />
          <Field name="address" label={o.address} autoComplete="street-address" required />
          <div className="space-y-1.5">
            <label htmlFor="note" className="text-sm font-medium">{o.note}</label>
            <textarea
              id="note"
              name="note"
              rows={3}
              className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={loading || offer <= 0}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {loading ? o.submitting : o.submit}
          </Button>
          <p className="text-center text-xs text-muted-foreground">{o.demoNote}</p>
        </form>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  hint,
  autoComplete,
  required,
}: {
  name: string;
  label: string;
  hint?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium">{label}</label>
      <input
        id={name}
        name={name}
        autoComplete={autoComplete}
        required={required}
        className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
