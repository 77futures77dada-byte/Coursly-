import { getTranslations, setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function AdminSubjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stub.adminSubjects");
  return (
    <Placeholder title={t("title")} description={t("description")} scope="mvp" />
  );
}
