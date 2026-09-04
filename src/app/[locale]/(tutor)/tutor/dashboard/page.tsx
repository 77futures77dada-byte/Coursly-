import { setRequestLocale } from "next-intl/server";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";
import { Placeholder } from "@/components/Placeholder";

export default async function TutorDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Placeholder
      title="Tutor dashboard"
      description="Pending booking requests to accept/decline, today's lessons, this month's earnings, verification status."
      scope="mvp"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {["Pending requests", "Lessons this week", "Earnings (month)"].map((l) => (
          <Card key={l}>
            <CardBody>
              <p className="text-sm text-text-muted">{l}</p>
              <p className="mt-1 text-2xl font-semibold">0</p>
            </CardBody>
          </Card>
        ))}
      </div>
      <div className="mt-4">
        <EmptyState title="No booking requests" body="New requests from students appear here for you to confirm." />
      </div>
    </Placeholder>
  );
}
