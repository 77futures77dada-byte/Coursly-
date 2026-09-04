import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Placeholder } from "@/components/Placeholder";

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <Placeholder
      title="Lesson detail"
      description={`Lesson ${id}: time, tutor, subject, status, notes, and the join button when it's time.`}
      scope="mvp"
    >
      <Link href={`/classroom/${id}`}>
        <Button size="sm">Join classroom</Button>
      </Link>
    </Placeholder>
  );
}
