"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LABELS: Record<string, string> = { et: "ET", ru: "RU", en: "EN" };

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-border p-0.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          disabled={isPending}
          onClick={() =>
            startTransition(() => {
              router.replace(pathname, { locale: loc });
            })
          }
          className={
            "rounded px-2 py-1 text-xs font-medium transition " +
            (loc === locale
              ? "bg-surface-muted text-text"
              : "text-text-muted hover:text-text")
          }
          aria-current={loc === locale ? "true" : undefined}
        >
          {LABELS[loc] ?? loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
