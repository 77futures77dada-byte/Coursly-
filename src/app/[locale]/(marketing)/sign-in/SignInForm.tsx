"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

/**
 * Minimal magic-link sign-in. `signInWithOtp` mails a link back to
 * /auth/callback, which exchanges the code for a session cookie.
 */
export function SignInForm({ next }: { next?: string }) {
  const t = useTranslations("signIn");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    const supabase = createClient();
    const callback = new URL("/auth/callback", window.location.origin);
    if (next) callback.searchParams.set("next", next);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: callback.toString() },
    });
    setState(error ? "error" : "sent");
  }

  async function google() {
    const supabase = createClient();
    const callback = new URL("/auth/callback", window.location.origin);
    if (next) callback.searchParams.set("next", next);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callback.toString() },
    });
  }

  if (state === "sent") {
    return <p className="text-sm text-text-muted">{t("checkEmail")}</p>;
  }

  return (
    <form onSubmit={sendLink} className="space-y-3">
      {next ? <p className="text-sm text-text-muted">{t("contextPrompt")}</p> : null}
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("emailPlaceholder")}
        className="h-10 w-full rounded-md border border-border bg-surface px-3 text-sm"
      />
      <Button type="submit" className="w-full" disabled={state === "sending"}>
        {t("sendMagicLink")}
      </Button>
      {state === "error" ? (
        <p className="text-sm text-danger">{t("linkError")}</p>
      ) : null}
      <div className="text-center text-xs text-text-muted">{t("or")}</div>
      <Button type="button" variant="secondary" className="w-full" onClick={google}>
        {t("continueWithGoogle")}
      </Button>
    </form>
  );
}
