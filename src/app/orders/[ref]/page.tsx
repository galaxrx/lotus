import Link from "next/link";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { buttonClasses } from "@/components/ui/button";
import { NiloosaMark } from "@/components/brand/logo";
import { getI18n } from "@/i18n/server";
import { cn } from "@/lib/utils";

export const metadata = { title: "Request received" };

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ ref: string }>;
}) {
  const { ref } = await params;
  const { dict } = await getI18n();
  const o = dict.order;

  return (
    <>
      <SiteHeader />
      <main id="main" className="grid min-h-[70dvh] place-items-center px-6 py-20">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check size={30} />
          </div>
          <h1 className="mt-6 text-3xl">{o.successTitle}</h1>
          <p className="mt-3 text-pretty text-muted-foreground">{o.successBody}</p>

          <div className="mt-8 rounded-2xl border border-border bg-surface p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{o.ref}</p>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-wide text-foreground">{ref}</p>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className={buttonClasses("secondary", "md")}>
              {o.backHome}
            </Link>
            <Link href="/discover" className={cn(buttonClasses("primary", "md"))}>
              {o.browse}
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-muted-foreground">
            <NiloosaMark tone="brand" className="h-5 w-5" />
            <span className="font-serif italic">Niloosa</span>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
