import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function TutorLayout({ children }: { children: ReactNode }) {
  const nav = [
    { href: "/tutor/dashboard", label: "Dashboard" },
    { href: "/tutor/students", label: "Students" },
    { href: "/tutor/schedule", label: "Schedule" },
    { href: "/tutor/homework", label: "Homework" },
    { href: "/tutor/materials", label: "Materials" },
    { href: "/tutor/earnings", label: "Earnings" },
  ];

  return (
    <AppShell nav={nav} title="Coursly · Tutor">
      {children}
    </AppShell>
  );
}
