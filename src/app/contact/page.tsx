import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getI18n } from "@/i18n/server";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  const { dict } = await getI18n();
  const c = dict.legal.contact;
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-dvh">
        <div className="container-page max-w-2xl py-16 md:py-24">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
            {dict.legal.back}
          </Link>
          <h1 className="text-4xl">{c.title}</h1>
          <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">{c.intro}</p>

          <div className="mt-10 rounded-2xl border border-border bg-surface p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail size={18} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{c.emailLabel}</p>
                <a href={`mailto:${c.email}`} className="text-lg font-medium link-underline">
                  {c.email}
                </a>
              </div>
            </div>
            <p className="mt-5 flex items-start gap-2 text-sm text-muted-foreground">
              <Send size={15} className="mt-0.5 shrink-0 text-gold" />
              {c.note}
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
