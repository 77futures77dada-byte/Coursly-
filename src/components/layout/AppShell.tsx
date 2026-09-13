import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/Logo";
import { revealDelay } from "@/lib/reveal";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";

export interface NavItem {
  href: string;
  label: string;
}

/**
 * Shell for authenticated areas (student / tutor / admin).
 * Sidebar on desktop, bottom nav on mobile.
 */
export function AppShell({
  nav,
  title,
  children,
}: {
  nav: NavItem[];
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-dvh md:grid md:grid-cols-[220px_1fr]">
      <aside className="reveal glass-subtle hidden md:flex md:flex-col">
        <div className="flex h-14 items-center border-b border-border px-4 text-[15px] font-semibold">
          <Link href="/" className="flex items-center gap-2">
            <Logo size={36} />
            Coursly
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-2 text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shine block rounded-md px-3 py-2 text-text-muted transition hover:bg-glass/10 hover:text-text"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <LocaleSwitcher />
        </div>
      </aside>

      <main className="pb-16 md:pb-0">
        <div
          className="reveal glass-subtle flex h-14 items-center justify-between px-4"
          style={revealDelay(80)}
        >
          <h1 className="text-sm font-semibold">{title}</h1>
        </div>
        <div className="mx-auto max-w-4xl p-4 md:p-6">{children}</div>
      </main>

      <MobileNav />
    </div>
  );
}
