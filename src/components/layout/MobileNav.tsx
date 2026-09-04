"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/dashboard", key: "home" },
  { href: "/find-tutor", key: "search" },
  { href: "/lessons", key: "lessons" },
  { href: "/messages", key: "messages" },
  { href: "/profile", key: "profile" },
] as const;

/** Bottom navigation on mobile (spec section 5). Hidden on md+. */
export function MobileNav() {
  const t = useTranslations("mobileNav");
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface md:hidden">
      <ul className="mx-auto flex max-w-md">
        {ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[11px]",
                  active ? "text-accent" : "text-text-muted",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    active ? "bg-accent" : "bg-transparent",
                  )}
                />
                {t(item.key)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
