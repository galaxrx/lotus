"use client";

import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/i18n/provider";

export function SiteFooter() {
  const { dict } = useI18n();
  const year = 2026;

  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="container-page py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo tone="brand" />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {dict.footer.tagline}
            </p>
            <LanguageSwitcher />
          </div>

          <FooterCol title={dict.footer.product}>
            <FooterLink href="/#how">{dict.footer.links.how}</FooterLink>
            <FooterLink href="/gallery">{dict.footer.links.gallery}</FooterLink>
            <FooterLink href="/styles">{dict.footer.links.styles}</FooterLink>
            <FooterLink href="/#sizes">{dict.footer.links.sizes}</FooterLink>
            <FooterLink href="/track">{dict.footer.links.track}</FooterLink>
          </FooterCol>

          <FooterCol title={dict.footer.company}>
            <FooterLink href="/about">{dict.footer.links.about}</FooterLink>
            <FooterLink href="/ateliers">{dict.nav.ateliers}</FooterLink>
            <FooterLink href="/studio">{dict.nav.portal}</FooterLink>
            <FooterLink href="/contact">{dict.footer.links.contact}</FooterLink>
          </FooterCol>

          <FooterCol title={dict.footer.legal}>
            <FooterLink href="/privacy">{dict.footer.links.privacy}</FooterLink>
            <FooterLink href="/terms">{dict.footer.links.terms}</FooterLink>
          </FooterCol>
        </div>

        <div className="hairline my-10" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} Niloosa. {dict.footer.rights}</p>
          <p className="max-w-sm text-center sm:text-end">{dict.footer.sources}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/70">
        {title}
      </h4>
      <ul className="space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
        {children}
      </Link>
    </li>
  );
}
