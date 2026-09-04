import Link from "next/link";
import { NextIntlClientProvider } from "next-intl";

// Root-level 404 for paths that never entered the [locale] segment.
// Kept minimal and locale-free on purpose.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui", display: "grid", placeItems: "center", minHeight: "100dvh", margin: 0 }}>
        <NextIntlClientProvider locale="en" messages={{}}>
          <main style={{ textAlign: "center" }}>
            <p style={{ color: "#647084", fontSize: 14 }}>404</p>
            <h1 style={{ fontSize: 18 }}>Page not found</h1>
            <Link href="/" style={{ color: "#4f46e5" }}>Coursly</Link>
          </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
