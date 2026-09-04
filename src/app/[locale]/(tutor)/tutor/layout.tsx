import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/layout/AppShell";

export default async function TutorLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations("tutorNav");

  const nav = [
    { href: "/tutor/dashboard", label: t("dashboard") },
    { href: "/tutor/students", label: t("students") },
    { href: "/tutor/schedule", label: t("schedule") },
    { href: "/tutor/homework", label: t("homework") },
    { href: "/tutor/materials", label: t("materials") },
    { href: "/tutor/earnings", label: t("earnings") },
  ];

  return (
    <AppShell nav={nav} title={t("title")}>
      {children}
    </AppShell>
  );
}
