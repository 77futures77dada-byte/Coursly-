import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { AppShell } from "@/components/layout/AppShell";

export default async function StudentLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations("nav");

  const nav = [
    { href: "/dashboard", label: t("dashboard") },
    { href: "/lessons", label: t("lessons") },
    { href: "/learning", label: t("learning") },
    { href: "/homework", label: t("homework") },
    { href: "/progress", label: t("progress") },
    { href: "/goals", label: t("goals") },
    { href: "/messages", label: t("messages") },
    { href: "/profile", label: t("profile") },
  ];

  return (
    <AppShell nav={nav} title="Coursly">
      {children}
    </AppShell>
  );
}
