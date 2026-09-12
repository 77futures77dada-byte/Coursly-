import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/require-user";
import { ChatThread } from "./ChatThread";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const user = await requireUser(`/messages/${id}`);
  const t = await getTranslations("chat");
  const supabase = await createClient();

  // RLS: this returns nothing unless the caller is a participant.
  const { data: conversation } = await supabase
    .from("conversations")
    .select("id, tutor_id")
    .eq("id", id)
    .maybeSingle();
  if (!conversation) notFound();

  const [{ data: partner }, { data: messages }, { data: tutorProfile }] = await Promise.all([
    supabase.rpc("conversation_partner", { conv_id: id }),
    supabase
      .from("messages")
      .select("id, body, sender_id, created_at")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true })
      .limit(100),
    supabase
      .from("tutor_profiles")
      .select("slug")
      .eq("user_id", conversation.tutor_id)
      .maybeSingle(),
  ]);

  return (
    <ChatThread
      conversationId={id}
      me={user.id}
      partnerName={partner?.[0]?.full_name ?? t("threadFallbackName")}
      bookHref={tutorProfile?.slug ? `/tutor/${tutorProfile.slug}/book` : null}
      initialMessages={messages ?? []}
    />
  );
}
