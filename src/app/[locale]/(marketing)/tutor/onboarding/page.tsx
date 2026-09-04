import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const STEP_KEYS = [
  "about",
  "subjects",
  "languages",
  "price",
  "availability",
  "video",
  "verification",
] as const;

/** Multi-step tutor profile onboarding → submitted for admin verification. */
export default async function TutorOnboardingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("tutorOnboarding");

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-text-muted">{t("intro")}</p>
      <Card className="mt-6">
        <CardBody>
          <ol className="space-y-3">
            {STEP_KEYS.map((key, i) => (
              <li key={key} className="flex items-center gap-3 text-sm">
                <span className="grid h-6 w-6 place-items-center rounded-full border border-border text-xs text-text-muted">
                  {i + 1}
                </span>
                <span>{t(`steps.${key}`)}</span>
                {key === "verification" ? (
                  <Badge tone="warning">{t("gdprBadge")}</Badge>
                ) : null}
              </li>
            ))}
          </ol>
        </CardBody>
      </Card>
    </div>
  );
}
