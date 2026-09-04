import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { MatchScore } from "./MatchScore";

type LocalizedText = Record<"et" | "ru" | "en", string>;

export interface TutorCardData {
  slug: string;
  name: string;
  headline: LocalizedText;
  subjectSlugs: string[];
  languages: string[];
  priceHour: number;
  rating: number;
  reviewCount: number;
  matchScore?: number;
}

/** Picks the field variant for the active locale, falling back to English. */
export function localized(text: LocalizedText, locale: string): string {
  return text[locale as keyof LocalizedText] ?? text.en;
}

export function TutorCard({
  tutor,
  showMatchScore = false,
}: {
  tutor: TutorCardData;
  /**
   * Only show the match % when it was actually computed from a user's survey
   * answers. On the landing page and unfiltered search there is no survey yet,
   * so a number here would be misleading — keep it off (the default).
   */
  showMatchScore?: boolean;
}) {
  const locale = useLocale();
  const tCard = useTranslations("tutorCard");
  const tSubjects = useTranslations("subjects");

  return (
    <Card className="transition hover:shadow-md">
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium">{tutor.name}</p>
            <p className="text-sm text-text-muted">{localized(tutor.headline, locale)}</p>
          </div>
          {showMatchScore && typeof tutor.matchScore === "number" ? (
            <MatchScore score={tutor.matchScore} />
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tutor.subjectSlugs.map((s) => (
            <Badge key={s}>{tSubjects(s)}</Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-text-muted">
            ★ {tutor.rating.toFixed(1)} · {tutor.reviewCount}
          </span>
          <span className="font-medium">€{tutor.priceHour}/h</span>
        </div>

        <Link
          href={`/tutor/${tutor.slug}`}
          className="block rounded-md border border-border py-2 text-center text-sm font-medium hover:bg-surface-muted"
        >
          {tCard("viewProfile")}
        </Link>
      </CardBody>
    </Card>
  );
}
