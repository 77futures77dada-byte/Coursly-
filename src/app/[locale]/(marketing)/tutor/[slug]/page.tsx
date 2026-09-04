import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { MatchScore } from "@/components/match/MatchScore";
import { localized } from "@/components/match/TutorCard";
import { MOCK_TUTORS } from "@/lib/mock/tutors";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tutor = MOCK_TUTORS.find((tu) => tu.slug === slug);
  if (!tutor) return {};
  const headline = localized(tutor.headline, locale);
  return { title: `${tutor.name} — ${headline}`, description: headline };
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

  const t = await getTranslations("tutorProfile");
  const tSubjects = await getTranslations("subjects");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{tutor.name}</h1>
            <p className="mt-1 text-text-muted">{localized(tutor.headline, locale)}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tutor.subjectSlugs.map((s) => (
                <Badge key={s}>{tSubjects(s)}</Badge>
              ))}
            </div>
          </div>
          <Card>
            <CardBody className="text-sm text-text-muted">{t("contentNote")}</CardBody>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardBody className="space-y-4">
              <MatchScore score={tutor.matchScore ?? 0} />
              <div className="text-2xl font-semibold">€{tutor.priceHour}/h</div>
              <Link href={`/tutor/${tutor.slug}/book`}>
                <Button className="w-full">{t("book")}</Button>
              </Link>
              <Link href="/messages">
                <Button variant="secondary" className="w-full">
                  {t("message")}
                </Button>
              </Link>
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
