import { setRequestLocale } from "next-intl/server";
import { Placeholder } from "@/components/Placeholder";
import { DEFAULT_PLATFORM_FEE_BPS } from "@/lib/constants";

export default async function AdminPaymentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Placeholder
      title="Payments"
      description={`Payments, refunds and payouts (Stripe Connect). Commission is currently ${DEFAULT_PLATFORM_FEE_BPS / 100}% and is editable here — the value is stored in platform_settings.`}
      scope="mvp"
    />
  );
}
