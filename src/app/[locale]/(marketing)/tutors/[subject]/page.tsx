import { setRequestLocale } from "next-intl/server";
import { TutorCard } from "@/components/match/TutorCard";
import { MOCK_TUTORS } from "@/lib/mock/tutors";

/** SEO landing per subject, e.g. /tutors/mathematics. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  const label = decodeURIComponent(subject).replace(/-/g, " ");
  return {
    title: `${label} tutors`,
    description: `Book verified ${label} tutors on Coursly.`,
  };
}

export default async function SubjectLandingPage({
  params,
}: {
  params: Promise<{ locale: string; subject: string }>;
}) {
  const { locale, subject } = await params;
  setRequestLocale(locale);
  const label = decodeURIComponent(subject).replace(/-/g, " ");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold capitalize tracking-tight">{label} tutors</h1>
      <p className="mt-2 max-w-prose text-sm text-text-muted">
        Static SEO page. Server-rendered list of verified tutors for this subject,
        with structured data for search engines.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {MOCK_TUTORS.map((tutor) => (
          <TutorCard key={tutor.slug} tutor={tutor} />
        ))}
      </div>
    </div>
  );
}
