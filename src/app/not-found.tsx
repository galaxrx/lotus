import Link from "next/link";
import { NiloosaMark } from "@/components/brand/logo";
import { buttonClasses } from "@/components/ui/button";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { dict } = await getI18n();
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div className="max-w-md">
        <NiloosaMark tone="brand" className="mx-auto h-14 w-14" />
        <p className="mt-6 font-serif text-6xl">404</p>
        <p className="mt-3 text-muted-foreground">
          {dict.discover.none}
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className={buttonClasses("secondary", "md")}>
            {dict.legal.back}
          </Link>
          <Link href="/discover" className={buttonClasses("primary", "md")}>
            {dict.nav.browse}
          </Link>
        </div>
      </div>
    </main>
  );
}
