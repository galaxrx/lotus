import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { GalleryGrid } from "@/components/gallery/gallery-grid";

export const metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-dvh">
        <GalleryGrid />
      </main>
      <SiteFooter />
    </>
  );
}
