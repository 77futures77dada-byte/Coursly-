import { setRequestLocale } from "next-intl/server";
import { OnboardingSurvey } from "./OnboardingSurvey";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <OnboardingSurvey />
    </div>
  );
}
