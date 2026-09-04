import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";

// Root-level 404 for paths that never entered the [locale] segment, so there is
// no active locale. All three launch languages are shown side by side.
export default function GlobalNotFound() {
  return (
    <html lang="et">
      <body style={{ fontFamily: "system-ui", display: "grid", placeItems: "center", minHeight: "100dvh", margin: 0 }}>
        <NextIntlClientProvider locale="et" messages={{}}>
          <main style={{ textAlign: "center", lineHeight: 1.6 }}>
            <p style={{ color: "#647084", fontSize: 14 }}>404</p>
            <h1 style={{ fontSize: 18, margin: "4px 0" }}>Lehte ei leitud</h1>
            <p style={{ fontSize: 18, margin: 0 }}>Страница не найдена</p>
            <p style={{ fontSize: 18, margin: 0 }}>Page not found</p>
            <Link href="/" style={{ display: "inline-block", marginTop: 16, color: "#4f46e5" }}>
              → Avaleht · На главную · Home
            </Link>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
