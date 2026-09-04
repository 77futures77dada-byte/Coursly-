import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";

const STAT_KEYS = ["upcomingLessons", "hoursLearned", "activeTutors"] as const;

export default async function StudentDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("studentDashboard");
  const tNav = await getTranslations("nav");

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {STAT_KEYS.map((key) => (
          <Card key={key}>
            <CardBody>
              <p className="text-sm text-text-muted">{t(`stats.${key}`)}</p>
              <p className="mt-1 text-2xl font-semibold">0</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <span className="text-sm font-semibold">{t("nextLesson")}</span>
        </CardHeader>
        <CardBody>
          <EmptyState
            title={t("emptyTitle")}
            body={t("emptyBody")}
            action={
              <Link href="/find-tutor">
                <Button size="sm">{tNav("findTutor")}</Button>
              </Link>
            }
          />
        </CardBody>
      </Card>
    </div>
  );
}
