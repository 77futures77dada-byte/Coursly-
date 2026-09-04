import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";
import { DEFAULT_PLATFORM_FEE_BPS } from "@/lib/constants";

export default async function TutorEarningsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const feePct = DEFAULT_PLATFORM_FEE_BPS / 100;
  return (
    <Placeholder
      title="Earnings"
      description={`Completed lessons, gross, platform fee (${feePct}% by default, set by admin), net payout, and payout requests via Stripe Connect. MVP = the basic ledger.`}
      scope="mvp"
    />
  );
}
