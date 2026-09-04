import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function ProgressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Progress"
      description="Metrics over time per subject. Not in the first release."
      scope="post-mvp"
    />
  );
}
