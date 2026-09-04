import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody } from "@/components/ui/Card";
import { Placeholder } from "@/components/Placeholder";

const STAT_KEYS = ["users", "tutorsVerified", "gmvMonth", "commissionMonth"] as const;

export default async function AdminOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("adminOverview");

  return (
    <Placeholder title={t("title")} description={t("description")} scope="mvp">
      <div className="grid gap-4 sm:grid-cols-4">
        {STAT_KEYS.map((key) => (
          <Card key={key}>
            <CardBody>
              <p className="text-sm text-text-muted">{t(`stats.${key}`)}</p>
              <p className="mt-1 text-2xl font-semibold">—</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </Placeholder>
  );
}
