import { getTranslations, setRequestLocale } from "next-intl/server";
import { EmptyState } from "@/components/ui/States";
import { Placeholder } from "@/components/Placeholder";

export default async function AdminReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stub.adminReports");
  return (
    <Placeholder title={t("title")} description={t("description")} scope="mvp">
      <EmptyState title={t("empty")} />
    </Placeholder>
  );
}
