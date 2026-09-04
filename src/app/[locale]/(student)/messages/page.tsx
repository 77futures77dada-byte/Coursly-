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
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "stub.messages" });
  const tStates = await getTranslations({ locale, namespace: "states" });

  return (
    <Placeholder title={tNav("messages")} description={t("description")} scope="mvp">
      <EmptyState title={tStates("emptyMessages")} />
    </Placeholder>
  );
}
