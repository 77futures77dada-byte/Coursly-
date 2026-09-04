import { setRequestLocale } from "next-intl/server";
import { Card, CardBody } from "@/components/ui/Card";
import { Placeholder } from "@/components/Placeholder";

export default async function AdminOverview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Placeholder
      title="Overview"
      description="Users, revenue, platform commission, verification queue length, open disputes."
      scope="mvp"
    >
      <div className="grid gap-4 sm:grid-cols-4">
        {["Users", "Tutors verified", "GMV (month)", "Commission (month)"].map((l) => (
          <Card key={l}>
            <CardBody>
              <p className="text-sm text-text-muted">{l}</p>
              <p className="mt-1 text-2xl font-semibold">—</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </Placeholder>
  );
}
