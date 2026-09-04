import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody } from "@/components/ui/Card";
import { TutorCard } from "@/components/match/TutorCard";
import { MOCK_TUTORS } from "@/lib/mock/tutors";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "search" });
  return { title: t("title") };
}

export default async function FindTutorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "search" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>

      <div className="mt-6 grid gap-6 md:grid-cols-[240px_1fr]">
        <aside>
          <Card>
            <CardBody className="space-y-4 text-sm">
              {(["subjectLabel", "levelLabel", "languageLabel", "priceLabel", "availabilityLabel"] as const).map(
                (k) => (
                  <div key={k}>
                    <label className="text-text-muted">{t(k)}</label>
                    <div className="mt-1 h-9 rounded-md border border-border bg-surface-muted" />
                  </div>
                ),
              )}
              <p className="text-xs text-text-muted">{t("filtersNote")}</p>
            </CardBody>
          </Card>
        </aside>

        <section>
          <p className="mb-3 text-sm text-text-muted">
            {t("resultsCount", { count: MOCK_TUTORS.length })}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {MOCK_TUTORS.map((tutor) => (
              <TutorCard key={tutor.slug} tutor={tutor} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
