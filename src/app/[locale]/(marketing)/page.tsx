import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { TutorCard } from "@/components/match/TutorCard";
import { HeroIllustrationLeft, HeroIllustrationRight } from "@/components/illustrations/HeroIllustrations";
import { MOCK_TUTORS } from "@/lib/mock/tutors";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <Landing />;
}

function Landing() {
  const t = useTranslations("marketing");

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="lg:grid lg:grid-cols-[140px_minmax(0,1fr)_140px] lg:items-center lg:gap-6">
          <HeroIllustrationLeft />
          <div className="text-center">
            <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
              {t("heroTitle")}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-pretty text-base text-text-muted">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Link href="/onboarding">
                <Button size="lg">{t("heroCtaPrimary")}</Button>
              </Link>
              <Link href="/#how-it-works">
                <Button size="lg" variant="secondary">
                  {t("heroCtaSecondary")}
                </Button>
              </Link>
            </div>
          </div>
          <HeroIllustrationRight />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {MOCK_TUTORS.map((tutor) => (
            <TutorCard key={tutor.slug} tutor={tutor} />
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-20">
        <h2 className="text-2xl font-semibold tracking-tight">{t("stepsTitle")}</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n}>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-accent-subtle text-sm font-semibold text-accent">
                {n}
              </div>
              <h3 className="mt-3 font-medium">{t(`step${n}Title`)}</h3>
              <p className="mt-1 text-sm text-text-muted">{t(`step${n}Body`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("forTutorsTitle")}
          </h2>
          <p className="max-w-lg text-sm text-text-muted">{t("forTutorsBody")}</p>
          <Link href="/tutor/onboarding">
            <Button variant="secondary">{t("forTutorsCta")}</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
