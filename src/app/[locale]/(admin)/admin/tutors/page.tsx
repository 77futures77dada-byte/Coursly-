import { setRequestLocale } from "next-intl/server";
import { EmptyState } from "@/components/ui/States";
import { Placeholder } from "@/components/Placeholder";

export default async function AdminTutorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Tutor verification"
      description="Queue of profiles awaiting review. Approve / reject / suspend. Verification documents are shown from a short-lived signed URL and purged after review (GDPR)."
      scope="mvp"
    >
      <EmptyState title="Verification queue is empty" />
    </Placeholder>
  );
}
