import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export default intlMiddleware;

export const config = {
  // Run on everything except API routes, Next internals, static files (anything
  // with a dot), and extensionless metadata routes like the generated
  // `app/apple-icon` PNG — those must not be rewritten to a locale path.
  matcher: ["/((?!api|_next|_vercel|apple-icon|.*\\..*).*)"],
};
