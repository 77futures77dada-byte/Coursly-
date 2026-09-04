import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LESSON_DURATIONS_MIN } from "@/lib/constants";

const SLOTS = [
  { day: "mon", time: "15:00" },
  { day: "tue", time: "17:00" },
  { day: "wed", time: "18:00" },
  { day: "thu", time: "16:00" },
  { day: "fri", time: "14:00" },
  { day: "sat", time: "11:00" },
] as const;

/**
 * Booking + payment. The price total, platform fee and tutor payout are computed
 * server-side (Edge Function) from the slot and duration — the client only picks.
 */
export default async function BookLessonPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "booking" });

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-xl font-semibold tracking-tight">{t("bookLesson")}</h1>
      <Card className="mt-6">
        <CardBody className="space-y-5">
          <div>
            <p className="text-sm text-text-muted">{t("selectSlot")}</p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {SLOTS.map((slot) => (
                <button
                  key={`${slot.day}-${slot.time}`}
                  className="rounded-md border border-border py-2 text-sm hover:border-accent"
                >
                  {t(`weekdaysShort.${slot.day}`)} {slot.time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-text-muted">{t("duration")}</p>
            <div className="mt-2 flex gap-2">
              {LESSON_DURATIONS_MIN.map((d) => (
                <button
                  key={d}
                  className="rounded-md border border-border px-3 py-1.5 text-sm hover:border-accent"
                >
                  {t("minutesShort", { count: d })}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-text-muted">{t("total")}</span>
            <span className="font-semibold">€28.00</span>
          </div>

          <Button className="w-full">{t("payAndBook")}</Button>
          <p className="text-center text-xs text-text-muted">{t("paymentNote")}</p>
        </CardBody>
      </Card>
    </div>
  );
}
