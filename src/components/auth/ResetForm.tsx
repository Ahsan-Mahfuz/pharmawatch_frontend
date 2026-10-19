"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BLANK_RESET, resetSchema } from "@/lib/auth-schemas";
import { useAuthForm } from "@/lib/useAuthForm";
import { resetPassword } from "@/store/auth.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthBusy, selectAuthFailure, selectResetState } from "@/store/selectors";
import { FormBanner } from "./FormBanner";
import { PasswordField } from "./PasswordField";
import { PasswordRules } from "./PasswordRules";

export function ResetForm() {
  const form = useAuthForm(resetSchema, BLANK_RESET);
  const token = useSearchParams().get("token") ?? "";
  const busy = useAppSelector(selectAuthBusy);
  const failure = useAppSelector(selectAuthFailure);
  const { done } = useAppSelector(selectResetState);
  const dispatch = useAppDispatch();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const values = form.validate();
    if (values) await dispatch(resetPassword({ token, password: values.password }));
  }

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <FormBanner tone="ok">
          Your password has been changed, and the link you used is now dead.
        </FormBanner>
        <Link href="/signin" className="btn btn-primary w-full">
          Sign in with the new password
        </Link>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex flex-col gap-4">
        <FormBanner tone="bad">
          This link is incomplete. Ask for a new one and open it straight from the email.
        </FormBanner>
        <Link href="/forgot-password" className="btn btn-quiet w-full">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {failure ? <FormBanner tone="bad">{failure.message}</FormBanner> : null}

      <div className="flex flex-col gap-2.5">
        <PasswordField id="password" label="New password" autoComplete="new-password"
          value={form.values.password} error={form.errors.password}
          onChange={(v) => form.set("password", v)} />
        <PasswordRules password={form.values.password} email="" />
      </div>

      <PasswordField id="confirm" label="Confirm new password" autoComplete="new-password"
        value={form.values.confirm} error={form.errors.confirm}
        onChange={(v) => form.set("confirm", v)} />

      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Saving…" : "Change the password"}
      </button>
    </form>
  );
}
