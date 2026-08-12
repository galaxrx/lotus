import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MatchClient } from "@/components/match/match-client";
import { getI18n } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getI18n();
  const m = dict.match;
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    alternates: { canonical: "/match" },
  };
}

export default function MatchPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-dvh">
        <MatchClient />
      </main>
      <SiteFooter />
    </>
  );
}
