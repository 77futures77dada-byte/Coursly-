import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function AdminSubjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Subjects"
      description="CRUD for subjects and categories, with localized names (name_et / name_ru / name_en)."
      scope="mvp"
    />
  );
}
