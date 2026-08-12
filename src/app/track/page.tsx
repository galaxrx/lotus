import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TrackForm } from "@/components/order/track-form";
import { getI18n } from "@/i18n/server";

export async function generateMetadata() {
  const { dict } = await getI18n();
  return { title: dict.track.title, description: dict.track.subtitle };
}

export default async function TrackPage() {
  const { dict } = await getI18n();
  const t = dict.track;

  return (
    <>
      <SiteHeader />
      <main id="main" className="container-page grid min-h-[70dvh] place-items-center py-12 md:py-16">
        <div className="w-full max-w-md">
          <div className="text-center">
            <p className="eyebrow">{dict.footer.links.track}</p>
            <h1 className="mt-3 text-balance text-3xl md:text-4xl">{t.title}</h1>
            <p className="mt-3 text-pretty text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="mt-8">
            <TrackForm
              label={t.label}
              placeholder={t.placeholder}
              button={t.button}
              hint={t.hint}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
