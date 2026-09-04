import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Users"
      description="Search, filter by role, block / unblock, soft-delete. Deletion honours the GDPR erasure flow."
      scope="mvp"
    />
  );
}
