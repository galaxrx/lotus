import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LegalArticle } from "@/components/legal/legal-article";
import { getI18n } from "@/i18n/server";

export const metadata = { title: "Terms of Service" };

export default async function TermsPage() {
  const { dict } = await getI18n();
  const t = dict.legal.terms;
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-dvh">
        <LegalArticle
          title={t.title}
          intro={t.intro}
          updated={dict.legal.updated}
          backLabel={dict.legal.back}
          sections={t.sections}
        />
      </main>
      <SiteFooter />
    </>
  );
}
