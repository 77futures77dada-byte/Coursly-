import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Logo } from "@/components/brand/Logo";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations("footer");

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-xs text-text-muted">
          <span className="flex items-center gap-2 font-medium text-text">
            <Logo size={20} />
            Coursly
          </span>
          <span>{t("tagline")}</span>
        </div>
      </footer>
    </div>
  );
}
