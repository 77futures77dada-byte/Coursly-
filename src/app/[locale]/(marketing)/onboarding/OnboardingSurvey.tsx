"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { MATCH_WEIGHTS } from "@/lib/matching/score";

type Answers = {
  subject: string;
  level: string;
  goal: string;
  language: string;
  budget: string;
  availability: string;
};

const STEPS: { key: keyof Answers; options: string[] }[] = [
  { key: "subject", options: ["Mathematics", "English", "Physics", "Chemistry", "Biology"] },
  { key: "level", options: ["Primary", "Basic school", "Gymnasium", "University", "Adult"] },
  { key: "goal", options: ["Catch up", "Improve grades", "State exam", "Language fluency"] },
  { key: "language", options: ["et", "ru", "en"] },
  { key: "budget", options: ["≤ 15", "15–25", "25–35", "35+"] },
  { key: "availability", options: ["Weekday mornings", "Weekday evenings", "Weekends", "Flexible"] },
];

const EMPTY: Answers = {
  subject: "",
  level: "",
  goal: "",
  language: "",
  budget: "",
  availability: "",
};

export function OnboardingSurvey() {
  const t = useTranslations("onboarding");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);

  const done = step >= STEPS.length;
  const current = STEPS[step];
  const progress = Math.round((step / STEPS.length) * 100);

  const previewScore = useMemo(() => {
    // Purely illustrative: how much of the weighted score each answered factor unlocks.
    const answered = Object.values(answers).filter(Boolean).length;
    const factorsCovered =
      MATCH_WEIGHTS.subject +
      MATCH_WEIGHTS.level +
      MATCH_WEIGHTS.goal +
      MATCH_WEIGHTS.language +
      MATCH_WEIGHTS.availability +
      MATCH_WEIGHTS.price;
    return Math.round((answered / STEPS.length) * factorsCovered * 100 + 40);
  }, [answers]);

  if (done) {
    return (
      <Card>
        <CardBody className="space-y-4 text-center">
          <p className="text-lg font-semibold">{t("submit")}</p>
          <p className="text-sm text-text-muted">
            With your answers we can already score {Object.values(MATCH_WEIGHTS).length}{" "}
            factors. Example best match:{" "}
            <span className="font-semibold text-accent">{Math.min(previewScore, 97)}%</span>
          </p>
          <Button className="w-full" onClick={() => setStep(0)}>
            {t("back")}
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardBody className="space-y-5">
        <div>
          <div className="h-1 w-full overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <h2 className="mt-4 text-base font-semibold">{t(current.key)}</h2>
        </div>

        <div className="grid gap-2">
          {current.options.map((opt) => {
            const selected = answers[current.key] === opt;
            return (
              <button
                key={opt}
                onClick={() =>
                  setAnswers((a) => ({ ...a, [current.key]: opt }))
                }
                className={
                  "rounded-md border px-3 py-2.5 text-left text-sm transition " +
                  (selected
                    ? "border-accent bg-accent-subtle text-accent"
                    : "border-border hover:border-accent")
                }
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            {t("back")}
          </Button>
          <Button
            size="sm"
            disabled={!answers[current.key]}
            onClick={() => setStep((s) => s + 1)}
          >
            {step === STEPS.length - 1 ? t("submit") : t("next")}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
