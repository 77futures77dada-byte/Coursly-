import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-[15px] font-semibold tracking-tight">
          Coursly
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-text-muted md:flex">
          <Link href="/find-tutor" className="hover:text-text">
            {t("findTutor")}
          </Link>
          <Link href="/#how-it-works" className="hover:text-text">
            {t("howItWorks")}
          </Link>
          <Link href="/tutor/onboarding" className="hover:text-text">
            {t("forTutors")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <Link href="/sign-in" className="hidden md:block">
            <Button variant="ghost" size="sm">
              {t("signIn")}
            </Button>
          </Link>
          <Link href="/onboarding">
            <Button size="sm">{t("getStarted")}</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
