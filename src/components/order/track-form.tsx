"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Guest order lookup: normalise the code and send the visitor to /orders/<ref>. */
export function TrackForm({
  label,
  placeholder,
  button,
  hint,
}: {
  label: string;
  placeholder: string;
  button: string;
  hint: string;
}) {
  const router = useRouter();
  const [code, setCode] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ref = code.trim().toUpperCase().replace(/\s+/g, "");
    if (ref) router.push(`/orders/${encodeURIComponent(ref)}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label htmlFor="code" className="block text-sm font-medium">{label}</label>
      <input
        id="code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={placeholder}
        dir="ltr"
        autoComplete="off"
        autoCapitalize="characters"
        className="h-12 w-full rounded-xl border border-border bg-surface px-4 text-center font-mono text-lg tracking-wider outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
      <Button type="submit" size="lg" className="w-full" disabled={!code.trim()}>
        {button} <ArrowRight size={18} className="rtl:rotate-180" />
      </Button>
      <p className="text-center text-xs text-muted-foreground">{hint}</p>
    </form>
  );
}
