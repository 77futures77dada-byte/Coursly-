import { setRequestLocale, getTranslations } from "next-intl/server";
import { EmptyState } from "@/components/ui/States";
import { Placeholder } from "@/components/Placeholder";

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <Placeholder
      title={t("messages")}
      description="Realtime chat (Supabase Realtime) between a student and a tutor they have an active relationship with. Attachments via Storage."
      scope="mvp"
    >
      <EmptyState title="No conversations yet" />
    </Placeholder>
  );
}
