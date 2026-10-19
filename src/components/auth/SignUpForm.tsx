"use client";

import { useRouter } from "next/navigation";
import { TextField } from "@/components/ui/Field";
import { BLANK_SIGN_UP, signUpSchema } from "@/lib/auth-schemas";
import { useAuthForm } from "@/lib/useAuthForm";
import { signUp } from "@/store/auth.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthBusy, selectAuthFailure } from "@/store/selectors";
import { CheckboxField } from "./CheckboxField";
import { FormBanner } from "./FormBanner";
import { PasswordField } from "./PasswordField";
import { PasswordRules } from "./PasswordRules";

export function SignUpForm() {
  const form = useAuthForm(signUpSchema, BLANK_SIGN_UP);
  const busy = useAppSelector(selectAuthBusy);
  const failure = useAppSelector(selectAuthFailure);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const values = form.validate();
    if (!values) return;

    const result = await dispatch(signUp(values));
    if (signUp.fulfilled.match(result)) router.replace("/");
    else form.blame(
        result.payload?.field,
        result.payload?.fieldMessage ?? result.payload?.message ?? "",
      );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {failure ? <FormBanner tone="bad">{failure.message}</FormBanner> : null}

      <TextField id="name" label="Your name" autoComplete="name"
        value={form.values.name} error={form.errors.name}
        onChange={(e) => form.set("name", e.target.value)} />

      <TextField id="pharmacy" label="Pharmacy name" autoComplete="organization"
        value={form.values.pharmacy} error={form.errors.pharmacy}
        onChange={(e) => form.set("pharmacy", e.target.value)} />

      <TextField id="email" label="Email" type="email" autoComplete="email" inputMode="email"
        value={form.values.email} error={form.errors.email}
        onChange={(e) => form.set("email", e.target.value)} />

      <div className="flex flex-col gap-2.5">
        <PasswordField id="password" label="Password" autoComplete="new-password"
          value={form.values.password} error={form.errors.password}
          onChange={(v) => form.set("password", v)} />
        <PasswordRules password={form.values.password} email={form.values.email} />
      </div>

      <PasswordField id="confirm" label="Confirm password" autoComplete="new-password"
        value={form.values.confirm} error={form.errors.confirm}
        onChange={(v) => form.set("confirm", v)} />

      <CheckboxField id="terms" checked={form.values.terms} error={form.errors.terms}
        onChange={(v) => form.set("terms", v)}>
        I am responsible for this pharmacy’s stock records and understand that returns and
        write-offs are logged against my name.
      </CheckboxField>

      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Setting things up…" : "Create the account"}
      </button>
    </form>
  );
}
