import { useTranslations } from "next-intl";
import { cn } from "@/lib/cn";

/**
 * The match score is one of only two places the accent color is allowed
 * (the other is CTAs). Keep it readable — a ring + a number, no chart.
 */
export function MatchScore({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  const t = useTranslations("search");
  const pct = Math.round(score);
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="grid h-9 w-9 place-items-center rounded-full bg-accent-subtle text-xs font-semibold text-accent"
        style={{
          background: `conic-gradient(rgb(var(--color-accent)) ${pct * 3.6}deg, rgb(var(--color-accent-subtle)) 0deg)`,
        }}
        aria-hidden
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-surface text-accent">
          {pct}
        </span>
      </span>
      <span className="text-sm text-text-muted">{t("matchScore", { score: pct })}</span>
    </div>
  );
}
