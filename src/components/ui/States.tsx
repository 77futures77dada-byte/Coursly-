"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Button } from "./Button";

/**
 * Explicit empty / error states — required by the spec (sections 52–53).
 * Always give the user a reason and a next step, never a bare error.
 */

export function EmptyState({
  title,
  body,
  action,
}: {
  title?: string;
  body?: string;
  action?: ReactNode;
}) {
  const t = useTranslations("states");
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-surface px-6 py-12 text-center">
      <p className="text-sm font-medium text-text">{title ?? t("emptyDefault")}</p>
      {body ? <p className="mt-1 max-w-sm text-sm text-text-muted">{body}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  const t = useTranslations("states");
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface px-6 py-12 text-center">
      <p className="text-sm font-medium text-danger">{t("errorTitle")}</p>
      <p className="mt-1 max-w-sm text-sm text-text-muted">{t("errorBody")}</p>
      {onRetry ? (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          {t("retry")}
        </Button>
      ) : null}
    </div>
  );
}
