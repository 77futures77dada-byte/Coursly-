import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function GoalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Goals"
      description="Target scores and deadlines per subject, updated as progress is recorded. Not in the first release."
      scope="post-mvp"
    />
  );
}
