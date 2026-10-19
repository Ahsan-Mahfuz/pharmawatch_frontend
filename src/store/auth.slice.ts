import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { SessionUser } from "@/lib/auth";
import {
  requestReset, resetPassword, restoreSession, signIn, signOut, signUp,
  type Failure,
} from "./auth.thunks";

export type AuthStatus = "booting" | "anon" | "authed";

export type AuthState = {
  user: SessionUser | null;
  status: AuthStatus;
  busy: boolean;
  failure: Failure | null;
  resetSent: boolean;
  resetDone: boolean;
  devToken: string | null;
};

const initialState: AuthState = {
  user: null,
  status: "booting",
  busy: false,
  failure: null,
  resetSent: false,
  resetDone: false,
  devToken: null,
};

const started = isAnyOf(signIn.pending, signUp.pending, requestReset.pending, resetPassword.pending);
const failed = isAnyOf(signIn.rejected, signUp.rejected, requestReset.rejected, resetPassword.rejected);
const signedIn = isAnyOf(signIn.fulfilled, signUp.fulfilled);

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearFailure: (s) => void (s.failure = null),
    clearReset: (s) => {
      s.resetSent = false;
      s.resetDone = false;
      s.devToken = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(restoreSession.fulfilled, (s, a) => {
      s.user = a.payload;
      s.status = a.payload ? "authed" : "anon";
    });

    b.addCase(requestReset.fulfilled, (s, a) => {
      s.busy = false;
      s.resetSent = true;
      s.devToken = a.payload.devToken ?? null;
    });

    b.addCase(resetPassword.fulfilled, (s) => {
      s.busy = false;
      s.resetDone = true;
    });

    b.addCase(signOut.fulfilled, (s) => {
      s.user = null;
      s.status = "anon";
      s.failure = null;
    });

    b.addMatcher(signedIn, (s, a) => {
      s.busy = false;
      s.user = a.payload;
      s.status = "authed";
      s.failure = null;
    });

    b.addMatcher(started, (s) => {
      s.busy = true;
      s.failure = null;
    });

    b.addMatcher(failed, (s, a) => {
      s.busy = false;
      s.failure = a.payload ?? { message: "Something went wrong. Please try again." };
    });
  },
});

export const { clearFailure, clearReset } = auth.actions;
export default auth.reducer;
