import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CollectionSurfer } from "@/components/ui/collection-surfer";
import { collectionItems } from "@/data/paintings";

export const metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <>
      {/* Back to home, above the fixed immersive scene */}
      <Link
        href="/"
        className="fixed start-5 top-5 z-[60] inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-medium uppercase tracking-wider text-white backdrop-blur-md transition-colors hover:bg-black/60"
      >
        <ArrowLeft size={14} className="rtl:rotate-180" />
        Lotus
      </Link>
      <CollectionSurfer items={collectionItems} variant="magnetic" />
    </>
  );
}
