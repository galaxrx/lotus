import { getI18n } from "@/i18n/server";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Hero,
  Marquee,
  HowItWorks,
  Featured,
  WallPreview,
  Sizes,
  Values,
  Faq,
  FinalCTA,
} from "@/components/marketing/sections";

export default async function HomePage() {
  const { dict } = await getI18n();

  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero dict={dict} />
        <Marquee dict={dict} />
        <HowItWorks dict={dict} />
        <Featured dict={dict} />
        <WallPreview dict={dict} />
        <Sizes dict={dict} />
        <Values dict={dict} />
        <Faq dict={dict} />
        <FinalCTA dict={dict} />
      </main>
      <SiteFooter />
    </>
  );
}
