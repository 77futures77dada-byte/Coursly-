import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { MatchScore } from "@/components/match/MatchScore";
import { MOCK_TUTORS } from "@/lib/mock/tutors";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tutor = MOCK_TUTORS.find((tu) => tu.slug === slug);
  return tutor
    ? { title: `${tutor.name} — ${tutor.headline}`, description: tutor.headline }
    : {};
}

/** SEO-friendly public tutor profile by slug. */
export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tutor = MOCK_TUTORS.find((tu) => tu.slug === slug);
  if (!tutor) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{tutor.name}</h1>
            <p className="mt-1 text-text-muted">{tutor.headline}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tutor.subjects.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>
          </div>
          <Card>
            <CardBody className="text-sm text-text-muted">
              Bio, intro video, subjects &amp; levels, languages, reviews and
              availability calendar render here.
            </CardBody>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardBody className="space-y-4">
              <MatchScore score={tutor.matchScore ?? 0} />
              <div className="text-2xl font-semibold">€{tutor.priceHour}/h</div>
              <Link href={`/tutor/${tutor.slug}/book`}>
                <Button className="w-full">Book a lesson</Button>
              </Link>
              <Link href="/messages">
                <Button variant="secondary" className="w-full">
                  Message
                </Button>
              </Link>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
