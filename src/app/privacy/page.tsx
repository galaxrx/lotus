import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LegalArticle } from "@/components/legal/legal-article";
import { getI18n } from "@/i18n/server";

export const metadata = { title: "Privacy Policy" };

export default async function PrivacyPage() {
  const { dict } = await getI18n();
  const p = dict.legal.privacy;
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-dvh">
        <LegalArticle
          title={p.title}
          intro={p.intro}
          updated={dict.legal.updated}
          backLabel={dict.legal.back}
          sections={p.sections}
        />
      </main>
      <SiteFooter />
    </>
  );
}
