import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card, CardBody } from "@/components/ui/Card";
import { revealDelay } from "@/lib/reveal";
import { SignInForm } from "./SignInForm";

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");
  const { next } = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="reveal text-xl font-semibold tracking-tight">{tNav("signIn")}</h1>
      <Card className="reveal mt-6" style={revealDelay(100)}>
        <CardBody>
          <SignInForm next={typeof next === "string" ? next : undefined} />
        </CardBody>
      </Card>
    </div>
  );
}
