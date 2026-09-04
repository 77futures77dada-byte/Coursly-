import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export default function LocaleNotFound() {
  const t = useTranslations("states");
  return (
    <div className="grid min-h-dvh place-items-center px-4 text-center">
      <div>
        <p className="text-sm font-medium text-text-muted">404</p>
        <h1 className="mt-1 text-lg font-semibold">{t("emptyDefault")}</h1>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="secondary" size="sm">
            Coursly
          </Button>
        </Link>
      </div>
    </div>
  );
}
