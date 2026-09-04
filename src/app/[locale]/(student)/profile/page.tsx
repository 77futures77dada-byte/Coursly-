import { setRequestLocale, getTranslations } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "stub.profile" });

  return (
    <Placeholder title={tNav("profile")} description={t("description")} scope="mvp" />
  );
}
