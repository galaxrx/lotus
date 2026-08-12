import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getI18n } from "@/i18n/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { formatMoney } from "@/lib/config";
import { styleLabel } from "@/lib/style-labels";
import type { Artwork } from "@/lib/portal";

export const metadata = { title: "Ateliers — work by our painters" };
export const dynamic = "force-dynamic";

type Row = Artwork & { artist: { handle: string; display_name: string; city: string } };

export default async function AteliersPage() {
  const { locale, dict } = await getI18n();
  const t = dict.ateliers;
  const currency: "usd" | "toman" = locale === "fa" ? "toman" : "usd";

  let rows: Row[] = [];
  if (supabaseConfigured()) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("artworks")
        .select("*, artist:artist_profiles!inner(handle, display_name, city)")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(120);
      rows = (data as Row[]) ?? [];
    } catch {
      rows = [];
    }
  }

  const priceOf = (w: Row) => {
    const amt = currency === "toman" ? w.price_toman : w.price_usd;
    if (!w.for_sale) return null;
    return amt ? formatMoney(amt, currency) : t.priceOnRequest;
  };

  return (
    <>
      <SiteHeader />
      <main id="main" className="container-page py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 className="mt-3 text-balance text-4xl md:text-5xl">{t.title}</h1>
          <p className="mt-4 text-pretty text-muted-foreground">{t.subtitle}</p>
        </div>

        {rows.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">{t.empty}</p>
        ) : (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((w) => {
              const title = locale === "fa" ? w.title_fa || w.title_en : w.title_en || w.title_fa;
              const price = priceOf(w);
              return (
                <Link
                  key={w.id}
                  href={`/ateliers/${w.artist.handle}`}
                  className="group block overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={w.image_url} alt={title} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="p-4">
                    <h2 className="truncate font-serif text-lg">{title}</h2>
                    <p className="text-sm text-muted-foreground">{t.by} {w.artist.display_name}</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{w.style ? styleLabel(w.style, locale) : ""}</span>
                      {price && <span className="font-medium">{price}</span>}
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                      {t.viewProfile} <ArrowRight size={14} className="rtl:rotate-180 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
