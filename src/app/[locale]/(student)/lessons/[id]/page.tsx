import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/Placeholder";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stub.lessonDetail");

  return (
    <Placeholder title={t("title")} description={t("description")} scope="mvp">
      <Link href={`/classroom/${id}`}>
        <Button size="sm">{t("join")}</Button>
      </Link>
    </Placeholder>
  );
}
