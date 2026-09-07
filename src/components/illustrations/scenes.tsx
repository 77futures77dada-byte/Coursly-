/**
 * Hero line-art atoms. Tri-tone, all decorative:
 *   - text-muted   base linework (figures, furniture, books)
 *   - accent       indigo — the progress line + dot, and the halos behind anchors
 *   - warm         amber — the two "alive" focal moments: the confirmed check and
 *                  the growth arrow. Amber lives ONLY here, never in the UI/CTA.
 * 2px rounded strokes, no filled figures or faces. Composed and animated by
 * HeroIllustrations.tsx.
 */

const strokeProps = {
  fill: "none" as const,
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Speech bubble with a checkmark — a confirmed message. Warm focal moment. */
export function ChatCheckScene() {
  return (
    <svg viewBox="0 0 64 48" className="h-[52px] w-[76px] text-text-muted" {...strokeProps}>
      <rect x="6" y="6" width="44" height="26" rx="10" stroke="currentColor" />
      <path d="M16 32 L12 42 L26 32" stroke="currentColor" />
      <circle cx="29" cy="19" r="8.5" className="fill-warm/20" stroke="none" />
      <path d="M18 19 L26 27 L40 11" className="stroke-warm" />
    </svg>
  );
}

/** Seated figure at a desk with an open book. Anchor scene — does not float. */
export function DeskBookScene() {
  return (
    <svg viewBox="0 0 96 72" className="h-[98px] w-[148px] text-text-muted" {...strokeProps}>
      <circle cx="66" cy="20" r="7" stroke="currentColor" />
      <path d="M55 58 Q57 30 66 28 Q76 30 78 58" stroke="currentColor" />
      <line x1="10" y1="58" x2="90" y2="58" stroke="currentColor" />
      <path d="M22 56 C22 46 32 43 40 47 C48 43 58 46 58 56" stroke="currentColor" />
      <line x1="40" y1="47" x2="40" y2="56" stroke="currentColor" />
      <path d="M58 40 Q50 45 42 49" stroke="currentColor" />
    </svg>
  );
}

/** A pencil resting near the book — quiet, no accent. Floats + tilts. */
export function PencilAccent() {
  return (
    <svg viewBox="0 0 40 20" className="h-[28px] w-[52px] text-text-muted" {...strokeProps}>
      <line x1="6" y1="16" x2="30" y2="5" stroke="currentColor" />
      <path d="M27 6.5 L30 5 L31 8" stroke="currentColor" />
    </svg>
  );
}

/** A short stack of books. */
export function BookStackScene() {
  return (
    <svg viewBox="0 0 56 32" className="h-[42px] w-[76px] text-text-muted" {...strokeProps}>
      <rect x="8" y="20" width="38" height="7" rx="2" stroke="currentColor" />
      <rect x="12" y="12" width="32" height="7" rx="2" stroke="currentColor" />
      <rect x="6" y="4" width="30" height="7" rx="2" stroke="currentColor" />
    </svg>
  );
}

/** Standing figure at a board with a pointer and a rising progress line (indigo).
 *  Anchor scene — does not float. */
export function TeachBoardScene() {
  return (
    <svg viewBox="0 0 96 72" className="h-[98px] w-[148px] text-text-muted" {...strokeProps}>
      <rect x="44" y="8" width="40" height="30" rx="2" stroke="currentColor" />
      <path d="M50 40 L45 58 M78 40 L83 58" stroke="currentColor" />
      <circle cx="20" cy="17" r="7" stroke="currentColor" />
      <path d="M20 24 L18 52" stroke="currentColor" />
      <path d="M18 52 L11 64 M18 52 L27 64" stroke="currentColor" />
      <path d="M21 30 L40 35" stroke="currentColor" />
      <line x1="40" y1="35" x2="48" y2="31" stroke="currentColor" />
      <path d="M50 32 L59 24 L67 28 L77 14" className="stroke-accent" />
      <circle cx="77" cy="14" r="2" className="fill-accent" stroke="none" />
    </svg>
  );
}

/** A small upward chevron — the growth motif. Warm focal moment. Floats. */
export function TrendUpAccent() {
  return (
    <svg viewBox="0 0 40 24" className="h-[34px] w-[52px] text-text-muted" {...strokeProps}>
      <path d="M8 20 L20 6 L32 20" className="stroke-warm" />
    </svg>
  );
}
