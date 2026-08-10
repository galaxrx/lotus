"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { buttonClasses } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { dict } = useI18n();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0" aria-label="Lotus home">
          <Logo tone="brand" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          <Link href="/#how" className="link-underline text-sm text-muted-foreground hover:text-foreground">
            {dict.nav.how}
          </Link>
          <Link href="/gallery" className="link-underline text-sm text-muted-foreground hover:text-foreground">
            {dict.nav.gallery}
          </Link>
          <Link href="/#sizes" className="link-underline text-sm text-muted-foreground hover:text-foreground">
            {dict.nav.sizes}
          </Link>
        </nav>

        <div className="flex items-center gap-1.5">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <ThemeToggle />
          <Link href="/discover" className={buttonClasses("primary", "sm")}>
            {dict.nav.browse}
          </Link>
        </div>
      </div>
    </header>
  );
}
