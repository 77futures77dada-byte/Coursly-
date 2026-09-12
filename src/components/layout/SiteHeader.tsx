import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function SiteHeader() {
  const t = useTranslations("nav");
  return (
    <header className="sticky top-0 z-40 glass-subtle">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-tight"
        >
          <Logo size={40} />
          Coursly
        </Link>

        <nav className="glass hidden items-center gap-1 rounded-full px-1.5 py-1.5 text-sm text-text-muted md:flex">
          <Link
            href="/find-tutor"
            className="rounded-full px-3 py-1.5 transition hover:bg-glass/10 hover:text-text"
          >
            {t("findTutor")}
          </Link>
          <Link
            href="/#how-it-works"
            className="rounded-full px-3 py-1.5 transition hover:bg-glass/10 hover:text-text"
          >
            {t("howItWorks")}
          </Link>
          <Link
            href="/tutor/onboarding"
            className="rounded-full px-3 py-1.5 transition hover:bg-glass/10 hover:text-text"
          >
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
