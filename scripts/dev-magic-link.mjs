// Dev-only. Creates (or reuses) an auth user and prints a sign-in URL you can
// paste straight into the browser — no inbox needed. Uses the service role key.
//
//   node --env-file=.env scripts/dev-magic-link.mjs student.test@example.com
//   node --env-file=.env scripts/dev-magic-link.mjs student.test@example.com "Test Student" /messages
//
// The link hits /auth/callback?token_hash=…&type=magiclink, which our callback
// verifies server-side (supabase.auth.verifyOtp) and turns into a session cookie.
//
// Prereq: add http://localhost:3000/** to Supabase → Auth → URL Configuration →
// Redirect URLs (only matters if you let Supabase send the email; the printed
// link below skips that).

import { createClient } from "@supabase/supabase-js";

const [email, fullName, next = "/messages"] = process.argv.slice(2);
if (!email) {
  console.error("usage: node --env-file=.env scripts/dev-magic-link.mjs <email> [fullName] [next]");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

// 1. ensure the user exists and is confirmed
const { data: created, error: createErr } = await admin.auth.admin.createUser({
  email,
  email_confirm: true,
  user_metadata: fullName ? { full_name: fullName } : undefined,
});
if (createErr && !/already been registered/i.test(createErr.message)) {
  console.error("createUser:", createErr.message);
  process.exit(1);
}
const userId =
  created?.user?.id ??
  (await admin.auth.admin.listUsers()).data.users.find((u) => u.email === email)?.id;
console.log(created?.user ? `created user ${userId}` : `user already existed ${userId}`);

// Ensure a public.profiles row (conversations.student_id FKs to it). Once the
// on_auth_user_created trigger from 0006 is applied this is redundant.
if (userId) {
  await admin
    .from("profiles")
    .upsert({ id: userId, email, full_name: fullName ?? null }, { onConflict: "id" });
}

// 2. generate a magic link and print a callback URL that skips the email
const redirectTo = `${appUrl}/auth/callback?next=${encodeURIComponent(next)}`;
const { data: link, error: linkErr } = await admin.auth.admin.generateLink({
  type: "magiclink",
  email,
  options: { redirectTo },
});
if (linkErr) {
  console.error("generateLink:", linkErr.message);
  process.exit(1);
}

const hashed = link.properties.hashed_token;
console.log("\nOpen this in the browser (as the student, e.g. a private window):\n");
console.log(`${appUrl}/auth/callback?token_hash=${hashed}&type=magiclink&next=${encodeURIComponent(next)}\n`);
console.log("(one-time use; re-run this script for a fresh link)");
