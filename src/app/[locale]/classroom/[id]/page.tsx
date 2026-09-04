import { setRequestLocale } from "next-intl/server";

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

  return (
    <div className="grid h-dvh grid-rows-[auto_1fr] bg-[#0d0f14] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-sm">
        <span>Classroom · lesson {id}</span>
        <button className="rounded-md bg-danger px-3 py-1 text-xs font-medium">
          Leave
        </button>
      </header>
      <div className="grid gap-3 p-3 md:grid-cols-[1fr_320px]">
        <div className="grid place-items-center rounded-lg border border-white/10 bg-black/40 text-sm text-white/50">
          Video area — LiveKit / Daily room mounts here
        </div>
        <div className="flex flex-col rounded-lg border border-white/10 bg-black/20">
          <div className="border-b border-white/10 px-3 py-2 text-xs uppercase tracking-wide text-white/50">
            Chat
          </div>
          <div className="flex-1 p-3 text-sm text-white/40">No messages yet.</div>
          <div className="border-t border-white/10 p-2">
            <input
              className="h-9 w-full rounded-md bg-white/5 px-3 text-sm outline-none"
              placeholder="Message…"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
