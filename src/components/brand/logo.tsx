import { cn } from "@/lib/utils";

/**
 * The Niloosa mark — a fanned five-petal lotus.
 * Monoline + currentColor by default so it adapts to any surface/theme.
 * Pass `tone="brand"` to render the emerald/rose/gold brand gradient.
 */
export function NiloosaMark({
  className,
  tone = "current",
  title = "Niloosa",
}: {
  className?: string;
  tone?: "current" | "brand";
  title?: string;
}) {
  const brand = tone === "brand";
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={title}
      className={cn("h-8 w-8", className)}
    >
      {brand && (
        <defs>
          <linearGradient id="lotus-leaf" x1="32" y1="8" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2A7E63" />
            <stop offset="1" stopColor="#14503F" />
          </linearGradient>
          <linearGradient id="lotus-petal" x1="32" y1="8" x2="32" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#E7B7B0" />
            <stop offset="1" stopColor="#C8756B" />
          </linearGradient>
        </defs>
      )}
      <g
        fill="none"
        stroke={brand ? undefined : "currentColor"}
        strokeWidth={2.4}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M32 52 C26 42 26 22 32 10 C38 22 38 42 32 52 Z" transform="rotate(-46 32 52)" stroke={brand ? "url(#lotus-leaf)" : undefined} />
        <path d="M32 52 C26 42 26 22 32 10 C38 22 38 42 32 52 Z" transform="rotate(46 32 52)" stroke={brand ? "url(#lotus-leaf)" : undefined} />
        <path d="M32 52 C26 42 26 22 32 10 C38 22 38 42 32 52 Z" transform="rotate(-23 32 52)" stroke={brand ? "url(#lotus-petal)" : undefined} />
        <path d="M32 52 C26 42 26 22 32 10 C38 22 38 42 32 52 Z" transform="rotate(23 32 52)" stroke={brand ? "url(#lotus-petal)" : undefined} />
        <path d="M32 52 C27 42 27 20 32 8 C37 20 37 42 32 52 Z" stroke={brand ? "url(#lotus-petal)" : undefined} />
      </g>
      <path
        d="M14 55 C22 59 42 59 50 55"
        fill="none"
        stroke={brand ? "#C6A15B" : "currentColor"}
        strokeOpacity={brand ? 1 : 0.6}
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Full lockup: mark + serif wordmark. */
export function Logo({
  className,
  markClassName,
  tone = "current",
}: {
  className?: string;
  markClassName?: string;
  tone?: "current" | "brand";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <NiloosaMark tone={tone} className={cn("h-7 w-7 text-primary", markClassName)} />
      <span className="font-serif text-xl font-semibold tracking-tight">Niloosa</span>
    </span>
  );
}
