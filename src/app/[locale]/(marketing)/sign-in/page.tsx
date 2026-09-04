import { setRequestLocale, getTranslations } from "next-intl/server";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default async function SignInPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations("nav");
  const t = await getTranslations("signIn");

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-semibold tracking-tight">{tNav("signIn")}</h1>
      <Card className="mt-6">
        <CardBody className="space-y-3">
          <input
            type="email"
            placeholder={t("emailPlaceholder")}
            className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
          />
          <Button className="w-full">{t("sendMagicLink")}</Button>
          <div className="text-center text-xs text-text-muted">{t("or")}</div>
          <Button variant="secondary" className="w-full">
            {t("continueWithGoogle")}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
