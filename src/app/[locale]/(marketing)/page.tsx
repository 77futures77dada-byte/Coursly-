import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { TutorCard } from "@/components/match/TutorCard";
import { HeroIllustrationLeft, HeroIllustrationRight } from "@/components/illustrations/HeroIllustrations";
import { MOCK_TUTORS } from "@/lib/mock/tutors";

function revealDelay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}

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
      <section className="hero-glow overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <div className="lg:grid lg:grid-cols-[168px_minmax(0,1fr)_168px] lg:items-center lg:gap-6">
            <HeroIllustrationLeft />
            <div className="text-center">
              <h1
                className="reveal mx-auto max-w-3xl text-balance font-display text-4xl tracking-tight sm:text-6xl"
                style={revealDelay(0)}
              >
                {t("heroTitle")}
              </h1>
              <p
                className="reveal mx-auto mt-5 max-w-xl text-pretty text-base text-text-muted"
                style={revealDelay(140)}
              >
                {t("heroSubtitle")}
              </p>
              <div
                className="reveal mt-8 flex items-center justify-center gap-3"
                style={revealDelay(280)}
              >
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
        <h2 className="font-display text-3xl tracking-tight">{t("stepsTitle")}</h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          {[1, 2, 3].map((n, i) => (
            <div key={n} className="reveal" style={revealDelay(i * 140)}>
              <div className="grid h-8 w-8 place-items-center rounded-full bg-accent-subtle text-sm font-semibold text-accent">
                <CountUp to={n} />
              </div>
              <h3 className="mt-3 font-medium">{t(`step${n}Title`)}</h3>
              <p className="mt-1 text-sm text-text-muted">{t(`step${n}Body`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="glass reveal rounded-xl px-6 py-10 sm:px-10">
          <h2 className="font-display text-2xl tracking-tight sm:text-3xl">
            {t("forTutorsTitle")}
          </h2>
          <p className="mt-3 max-w-lg text-sm text-text-muted">{t("forTutorsBody")}</p>
          <Link href="/tutor/onboarding" className="mt-6 inline-block">
            <Button variant="secondary" className="glow-accent">
              {t("forTutorsCta")}
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
