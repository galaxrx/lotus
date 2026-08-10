"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { buttonClasses } from "@/components/ui/button";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { dict } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on route change.
  useEffect(() => setOpen(false), [pathname]);

  // While the menu is open: lock scroll and allow Escape to close.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [
    { href: "/#how", label: dict.nav.how },
    { href: "/gallery", label: dict.nav.gallery },
    { href: "/artist", label: dict.nav.artist },
    { href: "/styles", label: dict.nav.styles },
    { href: "/#sizes", label: dict.nav.sizes },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled || open
          ? "border-b border-border/70 bg-background/95 backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="shrink-0" aria-label="Niloosa home">
          <Logo tone="brand" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-1.5 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link href="/discover" className={buttonClasses("primary", "sm")}>
            {dict.nav.browse}
          </Link>
        </div>

        {/* Mobile: language stays in the top bar, always one tap away */}
        <div className="flex items-center gap-1 md:hidden">
          <LanguageSwitcher />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? dict.gallery.close : dict.nav.menu}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <>
          <button
            type="button"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-x-0 bottom-0 top-16 z-30 bg-foreground/20 backdrop-blur-sm md:hidden"
          />
          <div
            id="mobile-menu"
            className="absolute inset-x-0 top-16 z-40 border-b border-border bg-background shadow-lift md:hidden"
          >
            <nav className="container-page flex flex-col py-3" aria-label="Mobile">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[48px] items-center rounded-lg px-2 text-base font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {l.label}
                </Link>
              ))}

              <div className="my-3 h-px bg-border" />

              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm text-muted-foreground">{dict.common.theme}</span>
                <ThemeToggle />
              </div>

              <Link
                href="/discover"
                onClick={() => setOpen(false)}
                className={cn(buttonClasses("primary", "lg"), "mt-3 w-full")}
              >
                {dict.nav.browse}
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
