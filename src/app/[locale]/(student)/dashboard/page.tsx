import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/States";

export default async function StudentDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {["Upcoming lessons", "Hours learned", "Active tutors"].map((label) => (
          <Card key={label}>
            <CardBody>
              <p className="text-sm text-text-muted">{label}</p>
              <p className="mt-1 text-2xl font-semibold">0</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <span className="text-sm font-semibold">Next lesson</span>
        </CardHeader>
        <CardBody>
          <EmptyState
            title="No lessons booked"
            body="Find a tutor and book your first lesson to get started."
            action={
              <Link href="/find-tutor">
                <Button size="sm">Find a tutor</Button>
              </Link>
            }
          />
        </CardBody>
      </Card>
    </div>
  );
}
