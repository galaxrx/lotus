import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Instagram, Globe, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getI18n } from "@/i18n/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/config";
import { formatMoney } from "@/lib/config";
import { ArtworkBuy } from "@/components/ateliers/artwork-buy";
import type { Artwork, ArtistProfile } from "@/lib/portal";

export const dynamic = "force-dynamic";

export default async function AtelierProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const { locale, dict } = await getI18n();
  const t = dict.ateliers;
  const currency: "usd" | "toman" = locale === "fa" ? "toman" : "usd";

  if (!supabaseConfigured()) notFound();
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("artist_profiles")
    .select("*")
    .eq("handle", handle)
    .eq("published", true)
    .maybeSingle();
  if (!profile) notFound();
  const artist = profile as ArtistProfile;

  const { data: worksData } = await supabase
    .from("artworks")
    .select("*")
    .eq("artist_id", artist.id)
    .eq("published", true)
    .order("created_at", { ascending: false });
  const works = (worksData as Artwork[]) ?? [];

  const bio = locale === "fa" ? artist.bio_fa || artist.bio_en : artist.bio_en || artist.bio_fa;

  return (
    <>
      <SiteHeader />
      <main id="main" className="container-page max-w-4xl py-12 md:py-16">
        <Link href="/ateliers" className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} className="rtl:rotate-180" /> {dict.nav.ateliers}
        </Link>

        <header className="border-b border-border pb-8">
          <h1 className="text-balance text-4xl md:text-5xl">{artist.display_name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {artist.city && <span className="inline-flex items-center gap-1"><MapPin size={14} /> {artist.city}</span>}
            {artist.instagram && (
              <a href={`https://instagram.com/${artist.instagram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
                <Instagram size={14} /> {artist.instagram}
              </a>
            )}
            {artist.website && (
              <a href={artist.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-foreground">
                <Globe size={14} /> {dict.portal.website}
              </a>
            )}
          </div>
          {bio && <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted-foreground">{bio}</p>}
        </header>

        {works.length === 0 ? (
          <p className="mt-12 text-muted-foreground">{dict.portal.worksEmpty}</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((w) => {
              const title = locale === "fa" ? w.title_fa || w.title_en : w.title_en || w.title_fa;
              const amt = currency === "toman" ? w.price_toman : w.price_usd;
              const buyable = w.for_sale && amt != null;
              const price = !w.for_sale ? null : amt ? formatMoney(amt, currency) : t.priceOnRequest;
              const desc = locale === "fa" ? w.description_fa || w.description_en : w.description_en || w.description_fa;
              return (
                <article key={w.id} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={w.image_url} alt={title} loading="lazy" className="aspect-[4/5] w-full object-cover" />
                  <div className="flex flex-1 flex-col p-4">
                    <h2 className="truncate font-serif text-lg">{title}</h2>
                    <p className="text-xs text-muted-foreground">
                      {[w.style.replace(/-/g, " "), w.medium, w.dimensions, w.year || ""].filter(Boolean).join(" · ")}
                    </p>
                    {desc && <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{desc}</p>}
                    <div className="mt-auto pt-3">
                      {price && <p className="font-medium">{price}</p>}
                      {buyable && (
                        <ArtworkBuy artworkId={w.id} title={title} imageUrl={w.image_url} priceLabel={formatMoney(amt!, currency)} />
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
