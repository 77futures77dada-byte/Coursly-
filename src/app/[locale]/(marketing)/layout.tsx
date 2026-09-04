import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-xs text-text-muted">
          <span className="font-medium text-text">Coursly</span>
          <span>Online tutoring — Estonia first, EU next.</span>
        </div>
      </footer>
    </div>
  );
}
