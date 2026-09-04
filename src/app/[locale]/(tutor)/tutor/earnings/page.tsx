import { getTranslations, setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";
import { DEFAULT_PLATFORM_FEE_BPS } from "@/lib/constants";

export default async function TutorEarningsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("stub.tutorEarnings");
  return (
    <Placeholder
      title={t("title")}
      description={t("description", { feePct: DEFAULT_PLATFORM_FEE_BPS / 100 })}
      scope="mvp"
    />
  );
}
