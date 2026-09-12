"use server";

import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * "Message" on a tutor profile: find-or-create the conversation between the
 * signed-in student and this tutor, then open the thread. Not signed in →
 * bounce to /sign-in with a return path.
 */
export async function startConversation(formData: FormData) {
  const tutorId = String(formData.get("tutorId") ?? "");
  const slug = String(formData.get("slug") ?? "");
  if (!tutorId) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();

  if (!user) {
    redirect({ href: { pathname: "/sign-in", query: { next: `/tutor/${slug}` } }, locale });
  }

  const me = user!.id;

  const findExisting = () =>
    supabase
      .from("conversations")
      .select("id")
      .eq("student_id", me)
      .eq("tutor_id", tutorId)
      .maybeSingle();

  let conversationId = (await findExisting()).data?.id;

  if (!conversationId) {
    const { data: created, error } = await supabase
      .from("conversations")
      .insert({ student_id: me, tutor_id: tutorId })
      .select("id")
      .single();

    if (created) {
      conversationId = created.id;
    } else if (error?.code === "23505") {
      // unique(student_id, tutor_id) race — re-read
      conversationId = (await findExisting()).data?.id;
    } else {
      // RLS rejected (e.g. tutor not verified) or another error — fall back
      redirect({ href: "/messages", locale });
    }
  }

  redirect({ href: `/messages/${conversationId}`, locale });
}
