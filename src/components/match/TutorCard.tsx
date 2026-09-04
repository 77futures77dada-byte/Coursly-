import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { Card, CardBody } from "@/components/ui/Card";
import { MatchScore } from "./MatchScore";

export interface TutorCardData {
  slug: string;
  name: string;
  headline: string;
  subjects: string[];
  languages: string[];
  priceHour: number;
  rating: number;
  reviewCount: number;
  matchScore?: number;
}

export function TutorCard({ tutor }: { tutor: TutorCardData }) {
  return (
    <Card className="transition hover:shadow-md">
      <CardBody className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-medium">{tutor.name}</p>
            <p className="text-sm text-text-muted">{tutor.headline}</p>
          </div>
          {typeof tutor.matchScore === "number" ? (
            <MatchScore score={tutor.matchScore} />
          ) : null}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tutor.subjects.map((s) => (
            <Badge key={s}>{s}</Badge>
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
          View profile
        </Link>
      </CardBody>
    </Card>
  );
}
