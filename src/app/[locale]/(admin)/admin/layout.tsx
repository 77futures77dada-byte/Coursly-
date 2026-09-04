import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const nav = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/tutors", label: "Tutor verification" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/payments", label: "Payments" },
    { href: "/admin/reports", label: "Reports & disputes" },
    { href: "/admin/subjects", label: "Subjects" },
  ];

  return (
    <AppShell nav={nav} title="Coursly · Admin">
      {children}
    </AppShell>
  );
}
