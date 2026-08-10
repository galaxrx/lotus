import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LegalArticle({
  title,
  intro,
  updated,
  backLabel,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  backLabel: string;
  sections: ReadonlyArray<{ h: string; b: string }>;
}) {
  return (
    <article className="container-page max-w-2xl py-16 md:py-24">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft size={16} className="rtl:rotate-180" />
        {backLabel}
      </Link>
      <h1 className="text-4xl">{title}</h1>
      <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">{updated}</p>
      <p className="mt-6 text-pretty leading-relaxed text-muted-foreground">{intro}</p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-xl">{s.h}</h2>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{s.b}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
