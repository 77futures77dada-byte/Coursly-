import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function LearningPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Learning"
      description="Materials shared by tutors, saved notes, AI flashcards. Not in the first release."
      scope="post-mvp"
    />
  );
}
