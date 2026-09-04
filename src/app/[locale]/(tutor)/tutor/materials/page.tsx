import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function TutorMaterialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Materials"
      description="Upload files with private / student / public visibility. Not in the first release."
      scope="post-mvp"
    />
  );
}
