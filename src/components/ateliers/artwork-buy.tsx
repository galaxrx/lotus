"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, ShoppingBag } from "lucide-react";
import { useI18n } from "@/i18n/provider";
import { Button } from "@/components/ui/button";

/**
 * "Buy this piece" for an artist's original work. Opens a short form and posts to
 * /api/artworks/[id]/order, which creates a commission already matched to the artist
 * and drops the buyer into the deposit step.
 */
export function ArtworkBuy({
  artworkId,
  title,
  imageUrl,
  priceLabel,
}: {
  artworkId: string;
  title: string;
  imageUrl: string;
  priceLabel: string;
}) {
  const { dict, locale } = useI18n();
  const t = dict.ateliers;
  const o = dict.order;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return; // guard against a double submit creating two orders
    setError(null);
    setLoading(true);
    try {
      const form = new FormData(e.currentTarget);
      const res = await fetch(`/api/artworks/${artworkId}/order`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          currency: locale === "fa" ? "toman" : "usd",
          name: String(form.get("name") ?? ""),
          contact: String(form.get("contact") ?? ""),
          address: String(form.get("address") ?? ""),
          note: String(form.get("note") ?? "") || undefined,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) setError(data?.error ?? o.error);
      else router.push(`/orders/${data.ref}`);
    } catch {
      setError(o.error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button size="sm" className="mt-3 w-full" onClick={() => setOpen(true)}>
        <ShoppingBag size={15} /> {t.buy}
      </Button>

      {open && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-background p-6 shadow-lift sm:rounded-3xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl">{t.buyTitle}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t.buySubtitle}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={o.cancel}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-surface p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt="" className="h-16 w-14 rounded-md object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{title}</p>
              </div>
              <span className="font-serif text-lg">{priceLabel}</span>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <Field name="name" label={o.name} autoComplete="name" required />
              <Field name="contact" label={o.contact} hint={o.contactHint} autoComplete="email" required />
              <Field name="address" label={o.address} autoComplete="street-address" required />
              <div className="space-y-1.5">
                <label htmlFor="note" className="text-sm font-medium">{o.note}</label>
                <textarea
                  id="note"
                  name="note"
                  rows={2}
                  className="w-full resize-y rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
                />
              </div>

              {error && (
                <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
                {loading ? o.submitting : t.buySubmit}
              </Button>
              <p className="text-center text-xs text-muted-foreground">{o.demoNote}</p>
            </form>
          </div>
        </div>
      )}
    </>
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
        className="h-11 w-full rounded-xl border border-border bg-surface px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
