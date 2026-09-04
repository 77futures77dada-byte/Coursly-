import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import { Placeholder } from "@/components/Placeholder";

const STAT_KEYS = ["pendingRequests", "lessonsThisWeek", "earningsMonth"] as const;

export default async function TutorDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tutorDashboard");

  return (
    <Placeholder title={t("title")} description={t("description")} scope="mvp">
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
      <div className="mt-4">
        <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
      </div>
    </Placeholder>
  );
}
