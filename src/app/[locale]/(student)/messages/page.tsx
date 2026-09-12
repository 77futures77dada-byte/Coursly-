import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/ui/States";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/supabase/require-user";

// Reads the session — must render per request, never prerendered (a build-time
// render has no cookies and would bake in the "redirect to sign-in" result).
export const dynamic = "force-dynamic";

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await requireUser("/messages");

  const tNav = await getTranslations("nav");
  const t = await getTranslations("chat");
  const tStates = await getTranslations("states");
  const format = await getFormatter();
  const supabase = await createClient();

  const { data: conversations } = await supabase
    .from("conversations")
    .select("id, updated_at")
    .order("updated_at", { ascending: false });

  // N+1 across a small list for now — a batch RPC / view is the follow-up.
  const rows = await Promise.all(
    (conversations ?? []).map(async (c) => {
      const [{ data: last }, { data: partner }] = await Promise.all([
        supabase
          .from("messages")
          .select("body, sender_id")
          .eq("conversation_id", c.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase.rpc("conversation_partner", { conv_id: c.id }),
      ]);
      return { c, last, partnerName: partner?.[0]?.full_name ?? null };
    }),
  );

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{tNav("messages")}</h2>

      {rows.length === 0 ? (
        <EmptyState title={tStates("emptyMessages")} />
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border">
          {rows.map(({ c, last, partnerName }) => (
            <li key={c.id}>
              <Link
                href={`/messages/${c.id}`}
                className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-surface-muted"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {partnerName ?? t("threadFallbackName")}
                  </p>
                  <p className="truncate text-sm text-text-muted">
                    {last?.body
                      ? last.sender_id === user.id
                        ? t("lastFromYou", { text: last.body })
                        : last.body
                      : t("emptyThread")}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-text-muted">
                  {format.relativeTime(new Date(c.updated_at))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
