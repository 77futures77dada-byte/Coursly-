import { cache } from "react";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { localized } from "@/components/match/TutorCard";
import { MOCK_TUTORS } from "@/lib/mock/tutors";
import { createClient } from "@/lib/supabase/server";
import { startConversation } from "./actions";

type TutorView = {
  slug: string;
  name: string;
  headline: string;
  subjectSlugs: string[];
  priceHour: number | null;
  /** real tutor_profiles.user_id when a verified row backs this slug — enables "Message" */
  messageableUserId: string | null;
};

/** Resolve the slug from mock display data and/or a real verified tutor_profiles row. */
const resolveTutor = cache(async (slug: string, locale: string): Promise<TutorView | null> => {
  const mock = MOCK_TUTORS.find((t) => t.slug === slug);

  const supabase = await createClient();
  const { data: real } = await supabase
    .from("tutor_profiles")
    .select("user_id, headline, price_hour")
    .eq("slug", slug)
    .eq("verification_status", "verified")
    .maybeSingle();

  if (!mock && !real) return null;

  if (mock) {
    return {
      slug,
      name: mock.name,
      headline: localized(mock.headline, locale),
      subjectSlugs: mock.subjectSlugs,
      priceHour: mock.priceHour,
      messageableUserId: real?.user_id ?? null,
    };
  }

  const { data: prof } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", real!.user_id)
    .maybeSingle();

  return {
    slug,
    name: prof?.full_name ?? "Tutor",
    headline: real!.headline ?? "",
    subjectSlugs: [],
    priceHour: real!.price_hour,
    messageableUserId: real!.user_id,
  };
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const tutor = await resolveTutor(slug, locale);
  if (!tutor) return {};
  return {
    title: tutor.headline ? `${tutor.name} — ${tutor.headline}` : tutor.name,
    description: tutor.headline || undefined,
  };
}

/** SEO-friendly public tutor profile by slug. */
export default async function TutorProfilePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const tutor = await resolveTutor(slug, locale);
  if (!tutor) notFound();

  const t = await getTranslations("tutorProfile");
  const tSubjects = await getTranslations("subjects");

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="grid gap-8 md:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{tutor.name}</h1>
            {tutor.headline ? (
              <p className="mt-1 text-text-muted">{tutor.headline}</p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tutor.subjectSlugs.map((s) => (
                <Badge key={s}>{tSubjects(s)}</Badge>
              ))}
            </div>
          </div>
          <Card>
            <CardBody className="text-sm text-text-muted">{t("contentNote")}</CardBody>
          </Card>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardBody className="space-y-4">
              <div className="text-2xl font-semibold">
                {tutor.priceHour != null ? `€${tutor.priceHour}/h` : "—"}
              </div>
              <Link href={`/tutor/${tutor.slug}/book`}>
                <Button className="w-full">{t("book")}</Button>
              </Link>
              {tutor.messageableUserId ? (
                <form action={startConversation}>
                  <input type="hidden" name="tutorId" value={tutor.messageableUserId} />
                  <input type="hidden" name="slug" value={tutor.slug} />
                  <Button type="submit" variant="secondary" className="w-full">
                    {t("message")}
                  </Button>
                </form>
              ) : (
                <Button variant="secondary" className="w-full" disabled>
                  {t("message")}
                </Button>
              )}
            </CardBody>
          </Card>
        </aside>
      </div>
    </div>
  );
}
