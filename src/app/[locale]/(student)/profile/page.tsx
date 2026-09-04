import { setRequestLocale, getTranslations } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <Placeholder
      title={t("profile")}
      description="Name, avatar, locale, notification preferences, and the onboarding survey answers (subject, level, goal, language, budget, availability) — editable."
      scope="mvp"
    />
  );
}
