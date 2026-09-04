import { getTranslations, setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function TutorStudentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stub.tutorStudents");
  return (
    <Placeholder title={t("title")} description={t("description")} scope="mvp" />
  );
}
