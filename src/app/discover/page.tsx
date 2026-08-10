import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DiscoverClient } from "@/components/discover/discover-client";

export const metadata = { title: "Find your painting" };

export default function DiscoverPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-dvh">
        <DiscoverClient />
      </main>
      <SiteFooter />
    </>
  );
}
