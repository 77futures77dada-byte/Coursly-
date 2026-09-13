import { getTranslations, setRequestLocale } from "next-intl/server";

/**
 * Classroom shell. Video is a bought provider (LiveKit/Daily) mounted here as a
 * client component with a server-minted access token; the wrapper (participant
 * strip, chat, later the whiteboard and homework panel) is ours.
 * MVP = video + text chat only.
 */
export default async function ClassroomPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("classroom");

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] bg-bg text-text">
      <header className="flex items-center justify-between border-b border-border px-4 py-2 text-sm">
        <span>{t("header", { id })}</span>
        <button className="rounded-md bg-danger px-3 py-1 text-xs font-medium text-white">
          {t("leave")}
        </button>
      </header>
      <div className="grid gap-3 p-3 md:grid-cols-[1fr_320px]">
        {/* Solid, not glass — a real <video> element lands here later; blur would smear it. */}
        <div className="grid place-items-center rounded-lg border border-border bg-surface text-sm text-text-muted">
          {t("videoPlaceholder")}
        </div>
        <div className="glass-subtle flex flex-col rounded-lg">
          <div className="border-b border-border px-3 py-2 text-xs uppercase tracking-wide text-text-muted">
            {t("chat")}
          </div>
          <div className="flex-1 p-3 text-sm text-text-muted">{t("noMessages")}</div>
          <div className="border-t border-border p-2">
            <input
              className="glass-subtle h-9 w-full rounded-md px-3 text-sm outline-none focus-visible:border-accent"
              placeholder={t("messagePlaceholder")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
