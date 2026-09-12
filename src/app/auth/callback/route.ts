import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Magic-link / OAuth landing. Handles both link shapes:
 *   - `?code=…`               PKCE (the normal browser flow via signInWithOtp)
 *   - `?token_hash=…&type=…`  server-verifiable OTP (also what an admin
 *                             generateLink produces — used for local testing)
 * On success we hold a session cookie, then bounce to `next` (or the dashboard).
 *
 * Not under [locale] — a plain utility route; the middleware matcher excludes
 * `auth` so it isn't rewritten to a locale path.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;
  const next = url.searchParams.get("next");
  const dest = new URL(next && next.startsWith("/") ? next : "/dashboard", url.origin);

  const supabase = await createClient();
  let error = null;

  if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash }));
  }

  if (error) {
    return NextResponse.redirect(new URL("/sign-in?error=auth", url.origin));
  }
  return NextResponse.redirect(dest);
}
