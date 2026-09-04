import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function TutorSchedulePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Schedule"
      description="Weekly availability windows (with timezone) plus confirmed lessons. Advanced calendar is post-MVP; MVP is recurring weekly windows."
      scope="mvp"
    />
  );
}
