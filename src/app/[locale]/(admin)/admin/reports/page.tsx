import { setRequestLocale } from "next-intl/server";
import { EmptyState } from "@/components/ui/States";
import { Placeholder } from "@/components/Placeholder";

export default async function AdminReportsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Reports & disputes"
      description="User reports and disputed bookings. Resolve, refund, or escalate."
      scope="mvp"
    >
      <EmptyState title="Nothing to moderate" />
    </Placeholder>
  );
}
