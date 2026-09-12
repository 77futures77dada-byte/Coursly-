"use client";

import { useEffect, useRef, useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type Message = {
  id: string;
  body: string | null;
  sender_id: string;
  created_at: string;
};

export function ChatThread({
  conversationId,
  me,
  partnerName,
  bookHref,
  initialMessages,
}: {
  conversationId: string;
  me: string;
  partnerName: string;
  bookHref: string | null;
  initialMessages: Message[];
}) {
  const t = useTranslations("chat");
  const format = useFormatter();
  const [supabase] = useState(() => createClient());
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [failed, setFailed] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | undefined;
    (async () => {
      const { data } = await supabase.auth.getSession();
      supabase.realtime.setAuth(data.session?.access_token ?? null);
      channel = supabase
        .channel(`conv:${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            const m = payload.new as Message;
            setMessages((prev) =>
              prev.some((x) => x.id === m.id) ? prev : [...prev, m],
            );
          },
        )
        .subscribe();
    })();
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setText("");
    setFailed(false);
    const { error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, body });
    if (error) {
      setFailed(true);
      setText(body);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <Link href="/messages" className="shrink-0 text-sm text-text-muted hover:text-text">
            ‹ {t("allConversations")}
          </Link>
          <span className="truncate text-sm font-medium">{partnerName}</span>
        </div>
        {bookHref ? (
          <Link href={bookHref} className="shrink-0 text-sm text-accent hover:underline">
            {t("arrangeTime")}
          </Link>
        ) : null}
      </div>

      <div className="flex max-h-[60vh] min-h-[240px] flex-col gap-2 overflow-y-auto py-2">
        {messages.length === 0 ? (
          <p className="m-auto text-sm text-text-muted">{t("emptyThread")}</p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === me;
            return (
              <div
                key={m.id}
                className={cn(
                  "max-w-[75%] rounded-lg px-3 py-2 text-sm",
                  mine
                    ? "ml-auto bg-accent-subtle text-accent"
                    : "mr-auto bg-surface-muted text-text",
                )}
              >
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <p
                  className={cn(
                    "mt-0.5 text-[11px]",
                    mine ? "text-accent/70" : "text-text-muted",
                  )}
                >
                  {format.dateTime(new Date(m.created_at), {
                    hour: "numeric",
                    minute: "numeric",
                  })}
                </p>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-end gap-2 border-t border-border pt-3"
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          placeholder={t("inputPlaceholder")}
          className="min-h-[40px] flex-1 resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm"
        />
        <Button type="submit" disabled={!text.trim()}>
          {t("send")}
        </Button>
      </form>
      {failed ? <p className="text-sm text-danger">{t("sendError")}</p> : null}
    </div>
  );
}
