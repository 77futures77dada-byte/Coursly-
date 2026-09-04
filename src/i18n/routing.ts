import { defineRouting } from "next-intl/routing";

/**
 * Launch locales: Estonian, Russian, English.
 * Planned next: fi, lv, lt (add the code + a messages/<code>.json catalog — nothing
 * else in the app hardcodes the list).
 */
export const routing = defineRouting({
  locales: ["et", "ru", "en"],
  defaultLocale: "et",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (routing.locales as readonly string[]).includes(value);
}
