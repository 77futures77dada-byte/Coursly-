import { setRequestLocale, getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/ui/States";
import { Placeholder } from "@/components/Placeholder";

export default async function LessonsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "stub.lessons" });

  return (
    <Placeholder title={tNav("lessons")} description={t("description")} scope="mvp">
      <EmptyState title={t("emptyTitle")} body={t("emptyBody")} />
    </Placeholder>
  );
}
