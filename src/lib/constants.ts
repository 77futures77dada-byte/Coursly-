/**
 * Bootstrap defaults. The runtime source of truth for anything an admin can change
 * (e.g. the platform fee) is the `platform_settings` table — read that on the server,
 * fall back to these.
 */
export const DEFAULT_PLATFORM_FEE_BPS = Number(process.env.PLATFORM_FEE_BPS ?? 1500); // 15%

export const LESSON_DURATIONS_MIN = [30, 45, 60, 90] as const;

export const SUPPORTED_CURRENCIES = ["EUR"] as const;

/** GDPR: verification documents are kept only this long, then purged by a job. */
export const VERIFICATION_DOC_RETENTION_DAYS = 30;
