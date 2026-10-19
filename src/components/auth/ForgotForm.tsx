"use client";

import Link from "next/link";
import { useEffect } from "react";
import { TextField } from "@/components/ui/Field";
import { forgotSchema } from "@/lib/auth-schemas";
import { useAuthForm } from "@/lib/useAuthForm";
import { clearReset } from "@/store/auth.slice";
import { requestReset } from "@/store/auth.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthBusy, selectAuthFailure, selectResetState } from "@/store/selectors";
import { FormBanner } from "./FormBanner";

export function ForgotForm() {
  const form = useAuthForm(forgotSchema, { email: "" });
  const busy = useAppSelector(selectAuthBusy);
  const failure = useAppSelector(selectAuthFailure);
  const { sent, devToken } = useAppSelector(selectResetState);
  const dispatch = useAppDispatch();

  useEffect(() => void dispatch(clearReset()), [dispatch]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const values = form.validate();
    if (values) await dispatch(requestReset(values));
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4">
        <FormBanner tone="ok">
          If {form.values.email} has an account, a reset link is on its way. It expires in
          30 minutes and can be used once.
        </FormBanner>

        {devToken ? (
          <p className="m-0 rounded-xl border border-dashed border-line-2 bg-paper-2 p-3.5 text-[12.5px] text-ink-2 text-pretty">
            No mail server is running, so here is the link the email would have carried:{" "}
            <Link href={`/reset-password?token=${devToken}`} className="num font-semibold">
              open the reset link
            </Link>
          </p>
        ) : null}

        <Link href="/signin" className="btn btn-quiet w-full">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {failure ? <FormBanner tone="bad">{failure.message}</FormBanner> : null}

      <TextField id="email" label="Email" type="email" autoComplete="email" inputMode="email"
        value={form.values.email} error={form.errors.email}
        onChange={(e) => form.set("email", e.target.value)} />

      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Sending…" : "Send the reset link"}
      </button>
    </form>
  );
}
