"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { TextField } from "@/components/ui/Field";
import { BLANK_SIGN_IN, signInSchema } from "@/lib/auth-schemas";
import { useAuthForm } from "@/lib/useAuthForm";
import { signIn } from "@/store/auth.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthBusy, selectAuthFailure } from "@/store/selectors";
import { CheckboxField } from "./CheckboxField";
import { FormBanner } from "./FormBanner";
import { PasswordField } from "./PasswordField";

export function SignInForm() {
  const form = useAuthForm(signInSchema, BLANK_SIGN_IN);
  const busy = useAppSelector(selectAuthBusy);
  const failure = useAppSelector(selectAuthFailure);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const next = useSearchParams().get("next") ?? "/";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const values = form.validate();
    if (!values) return;

    const result = await dispatch(signIn(values));
    if (signIn.fulfilled.match(result)) router.replace(next);
    else form.blame(
        result.payload?.field,
        result.payload?.fieldMessage ?? result.payload?.message ?? "",
      );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      {failure ? <FormBanner tone="bad">{failure.message}</FormBanner> : null}

      <TextField
        id="email" label="Email" type="email" autoComplete="email" inputMode="email"
        value={form.values.email} error={form.errors.email}
        onChange={(e) => form.set("email", e.target.value)}
      />

      <PasswordField
        id="password" label="Password" autoComplete="current-password"
        value={form.values.password} error={form.errors.password}
        onChange={(v) => form.set("password", v)}
        hint={
          <Link href="/forgot-password" className="text-[12.5px] font-semibold">
            Forgot it?
          </Link>
        }
      />

      <CheckboxField id="remember" checked={form.values.remember}
        onChange={(v) => form.set("remember", v)}>
        Keep me signed in on this device
      </CheckboxField>

      <button type="submit" className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
