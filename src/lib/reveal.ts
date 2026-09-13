import type { CSSProperties } from "react";

/** Inline `--reveal-delay` for staggering `.reveal` siblings (see globals.css). */
export function revealDelay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}
