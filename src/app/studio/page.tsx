import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { NiloosaMark } from "@/components/brand/logo";
import { StudioClient } from "@/app/studio/studio-client";
import { getI18n } from "@/i18n/server";
import { supabaseConfigured } from "@/lib/supabase/config";

export const metadata = { title: "Artist studio" };
export const dynamic = "force-dynamic";

export default async function StudioPage() {
  const { dict } = await getI18n();
  const p = dict.portal;
  const configured = supabaseConfigured();

  return (
    <>
      <SiteHeader />
      <main id="main" className="container-page max-w-4xl py-12 md:py-16">
        <p className="eyebrow">{p.heroEyebrow}</p>
        {configured ? (
          <>
            <div className="mt-3 max-w-2xl">
              <h1 className="sr-only">{p.dashboardTitle}</h1>
              <p className="text-pretty text-muted-foreground">{p.heroBody}</p>
            </div>
            <div className="mt-8">
              <StudioClient />
            </div>
          </>
        ) : (
          <div className="mt-8 grid place-items-center rounded-3xl border border-border bg-surface px-6 py-20 text-center">
            <NiloosaMark tone="brand" className="mb-5 h-10 w-10" />
            <h1 className="max-w-lg text-balance text-3xl">{p.comingSoonTitle}</h1>
            <p className="mt-3 max-w-md text-pretty text-muted-foreground">{p.comingSoonBody}</p>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
