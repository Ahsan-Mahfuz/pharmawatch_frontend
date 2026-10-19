import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthError, authApi } from "@/lib/auth";
import type { ResetInput, SessionUser, SignInInput, SignUpInput } from "@/lib/auth";

export type Failure = { message: string; field?: string; fieldMessage?: string };

const asFailure = (error: unknown): Failure =>
  error instanceof AuthError
    ? {
        message: error.message,
        ...(error.field ? { field: error.field } : {}),
        ...(error.fieldMessage ? { fieldMessage: error.fieldMessage } : {}),
      }
    : { message: "Something went wrong. Please try again." };

const attempt = <Arg, Result>(name: string, run: (arg: Arg) => Promise<Result>) =>
  createAsyncThunk<Result, Arg, { rejectValue: Failure }>(
    `auth/${name}`,
    async (arg, { rejectWithValue }) => {
      try {
        return await run(arg);
      } catch (error) {
        return rejectWithValue(asFailure(error));
      }
    },
  );

export const signIn = attempt<SignInInput, SessionUser>("signIn", (i) => authApi.signIn(i));
export const signUp = attempt<SignUpInput, SessionUser>("signUp", (i) => authApi.signUp(i));

export const requestReset = attempt<{ email: string }, { sent: true; devToken?: string }>(
  "requestReset",
  (i) => authApi.requestReset(i),
);

export const resetPassword = attempt<ResetInput, { ok: true }>(
  "resetPassword",
  (i) => authApi.resetPassword(i),
);

export const signOut = attempt<void, void>("signOut", () => authApi.signOut());

export const restoreSession = createAsyncThunk("auth/restore", () => authApi.restore());
