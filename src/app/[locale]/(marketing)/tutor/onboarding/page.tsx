import { setRequestLocale } from "next-intl/server";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const STEPS = [
  "About you & headline",
  "Subjects & levels",
  "Languages",
  "Price per hour",
  "Weekly availability",
  "Intro video",
  "Identity verification",
];

/** Multi-step tutor profile onboarding → submitted for admin verification. */
export default async function TutorOnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-xl font-semibold tracking-tight">Become a tutor</h1>
      <p className="mt-2 text-sm text-text-muted">
        Seven steps. When you submit, your profile goes to the Coursly team for
        verification before it appears in search.
      </p>
      <Card className="mt-6">
        <CardBody>
          <ol className="space-y-3">
            {STEPS.map((label, i) => (
              <li key={label} className="flex items-center gap-3 text-sm">
                <span className="grid h-6 w-6 place-items-center rounded-full border border-border text-xs text-text-muted">
                  {i + 1}
                </span>
                <span>{label}</span>
                {i === 6 ? <Badge tone="warning">GDPR: doc deleted after review</Badge> : null}
              </li>
            ))}
          </ol>
        </CardBody>
      </Card>
    </div>
  );
}
