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
  const t = await getTranslations({ locale, namespace: "nav" });

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <h1 className="text-xl font-semibold tracking-tight">{t("signIn")}</h1>
      <Card className="mt-6">
        <CardBody className="space-y-3">
          <input
            type="email"
            placeholder="you@example.com"
            className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
          />
          <Button className="w-full">Send magic link</Button>
          <div className="text-center text-xs text-text-muted">or</div>
          <Button variant="secondary" className="w-full">
            Continue with Google
          </Button>
          <p className="pt-1 text-center text-xs text-text-muted">
            Auth is handled by Supabase Auth (magic link + OAuth).
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
