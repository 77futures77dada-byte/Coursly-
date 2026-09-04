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
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <Placeholder title={t("lessons")} scope="mvp">
      <EmptyState title="No lessons yet" body="Upcoming, past and cancelled lessons show up here in tabs." />
    </Placeholder>
  );
}
