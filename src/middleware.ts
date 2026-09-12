import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default intlMiddleware;

export const config = {
  // Run on everything except API routes, Next internals, static files (anything
  // with a dot), the generated `app/apple-icon` PNG, and the `auth/*` utility
  // routes (magic-link callback) — none of those may be rewritten to a locale.
  matcher: ["/((?!api|_next|_vercel|apple-icon|auth|.*\\..*).*)"],
};
