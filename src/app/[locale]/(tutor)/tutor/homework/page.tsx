import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function TutorHomeworkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Homework"
      description="Create assignments, review submissions, leave scores and feedback. Not in the first release."
      scope="post-mvp"
    />
  );
}
