/**
 * Coursly monogram: a rounded square in --color-accent (theme-aware via the
 * `fill-accent` Tailwind token, same as the rest of the app), an open "C" arc
 * and an accent dot in white. Decorative — always paired with the "Coursly"
 * wordmark in the UI, so it carries no accessible name.
 *
 * Geometry is authored in a 64×64 grid; the static favicon (src/app/icon.svg)
 * and the apple-touch icon (src/app/apple-icon.tsx) reuse the same coordinates.
 */
export function Logo({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden
    >
      <rect width="64" height="64" rx="16" className="fill-accent" />
      <path
        d="M46 20 A18 18 0 1 0 46 44"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="46" cy="32" r="3.5" fill="#fff" />
    </svg>
  );
}
