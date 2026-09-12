import { getLocale } from "next-intl/server";
import { redirect, getPathname } from "@/i18n/navigation";
import { createClient } from "./server";

/**
 * Per-page auth gate. Temporary stand-in until real middleware guards exist:
 * every protected page / server action calls this at the top. `getUser()`
 * validates the JWT against Supabase's auth server, so it's a real check, not
 * just a cookie read. No token refresh happens (middleware still does i18n
 * only), so a session silently lapses ~1h after the last full navigation.
 *
 * `next` is an unlocalized app path (e.g. "/messages/abc"); it is localized here
 * so the plain /auth/callback route can redirect straight back to it.
 */
export async function requireUser(next?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const locale = await getLocale();
    const query = next ? { next: getPathname({ href: next, locale }) } : undefined;
    redirect({
      href: query ? { pathname: "/sign-in", query } : "/sign-in",
      locale,
    });
  }

  return user!;
}
