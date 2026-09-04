import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function HomeworkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Homework"
      description="Assignments from tutors, submissions, scores and feedback. Not in the first release."
      scope="post-mvp"
    />
  );
}
