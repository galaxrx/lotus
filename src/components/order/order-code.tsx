"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, Check, ArrowRight } from "lucide-react";

/**
 * Prominent "your order code" card. Makes clear WHAT to save and WHERE to use it:
 * the code big with a copy button, plus a direct link to the track page.
 */
export function OrderCode({
  code,
  title,
  note,
  copyLabel,
  copiedLabel,
  trackLabel,
}: {
  code: string;
  title: string;
  note: string;
  copyLabel: string;
  copiedLabel: string;
  trackLabel: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — the code is visible to copy by hand */
    }
  }

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <span className="font-mono text-3xl font-bold tracking-[0.15em] text-foreground" dir="ltr">{code}</span>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-background px-3.5 text-xs text-muted-foreground hover:bg-muted cursor-pointer"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? copiedLabel : copyLabel}
        </button>
      </div>
      <p className="mx-auto mt-4 max-w-md text-pretty text-sm text-muted-foreground">{note}</p>
      <Link
        href="/track"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary link-underline"
      >
        {trackLabel}
        <ArrowRight size={15} className="rtl:rotate-180" />
      </Link>
    </div>
  );
}
