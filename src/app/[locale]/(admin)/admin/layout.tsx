import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/layout/AppShell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations("adminNav");

  const nav = [
    { href: "/admin", label: t("overview") },
    { href: "/admin/tutors", label: t("tutors") },
    { href: "/admin/users", label: t("users") },
    { href: "/admin/payments", label: t("payments") },
    { href: "/admin/reports", label: t("reports") },
    { href: "/admin/subjects", label: t("subjects") },
  ];

  return (
    <AppShell nav={nav} title={t("title")}>
      {children}
    </AppShell>
  );
}
