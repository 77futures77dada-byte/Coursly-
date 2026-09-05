import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import { TutorCard } from "@/components/match/TutorCard";
import { MOCK_TUTORS } from "@/lib/mock/tutors";

type SearchParams = Record<string, string | string[] | undefined>;

// Onboarding sends all six answers; the mocks only carry structured data for
// three of them (subject → subjectSlugs, language → languages, budget →
// priceHour). level / goal / availability ride along in the URL but there is
// nothing to match them against until real tutor profiles exist.
const BUDGET_CEILING: Record<string, number> = {
  lt15: 15,
  b15_25: 25,
  b25_35: 35,
  gt35: Infinity,
};

const ONBOARDING_KEYS = ["subject", "level", "goal", "language", "budget", "availability"] as const;

function str(v: string | string[] | undefined): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function filterTutors(sp: SearchParams) {
  const subject = str(sp.subject);
  const language = str(sp.language);
  const budget = str(sp.budget);
  const ceiling = budget ? BUDGET_CEILING[budget] : undefined;

  return MOCK_TUTORS.filter((tutor) => {
    if (subject && !tutor.subjectSlugs.includes(subject)) return false;
    if (language && !tutor.languages.includes(language)) return false;
    if (ceiling !== undefined && tutor.priceHour > ceiling) return false;
    return true;
  });
}

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
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "search" });
  const tStates = await getTranslations({ locale, namespace: "states" });

  const sp = await searchParams;
  const fromOnboarding = ONBOARDING_KEYS.some((k) => str(sp[k]));
  const tutors = fromOnboarding ? filterTutors(sp) : MOCK_TUTORS;

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
          {fromOnboarding && tutors.length === 0 ? (
            <EmptyState
              title={tStates("emptyMatches")}
              action={
                <Link href="/find-tutor">
                  <Button variant="secondary" size="sm">
                    {t("clearFilters")}
                  </Button>
                </Link>
              }
            />
          ) : (
            <>
              <p className="mb-3 text-sm text-text-muted">
                {t("resultsCount", { count: tutors.length })}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {tutors.map((tutor) => (
                  <TutorCard key={tutor.slug} tutor={tutor} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
