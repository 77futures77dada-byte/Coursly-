import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function TutorStudentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Students"
      description="Students with an active relationship (a confirmed or completed booking). RLS scopes a tutor to exactly these."
      scope="mvp"
    />
  );
}
