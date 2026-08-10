import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ArtDetail } from "@/components/art/art-detail";
import { getPainting } from "@/lib/catalog";
import { imageOf } from "@/data/paintings";

export default async function ArtPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ size?: string }>;
}) {
  const { id } = await params;
  const { size } = await searchParams;
  const painting = getPainting(Number(id));
  if (!painting) notFound();

  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-dvh">
        <ArtDetail
          painting={{
            id: painting.id,
            title: painting.title,
            artist: painting.artist,
            imageUrl: imageOf(painting),
            category: painting.category,
            complexity: painting.complexity,
          }}
          initialSize={size}
        />
      </main>
      <SiteFooter />
    </>
  );
}
