import { api, refreshSession, setAccessToken } from "@/lib/api/client";
import type { WireSession } from "@/lib/api/wire";
import { toSessionUser, type SessionUser } from "./session";
import type { AuthApi } from "./types";

const adopt = (payload: WireSession): SessionUser => {
  setAccessToken(payload.accessToken);
  return toSessionUser(payload.account);
};

export const authApi: AuthApi = {
  signIn: async (input) =>
    adopt(await api<WireSession>("/auth/login", { body: input, auth: false })),

  signUp: async (input) =>
    adopt(await api<WireSession>("/auth/register", { body: input, auth: false })),

  requestReset: (input) =>
    api<{ sent: true; devToken?: string }>("/auth/forgot-password", {
      body: input,
      auth: false,
    }),

  resetPassword: (input) =>
    api<{ ok: true }>("/auth/reset-password", { body: input, auth: false }),

  restore: async () => {
    try {
      return adopt(await refreshSession<WireSession>());
    } catch {
      setAccessToken(null);
      return null;
    }
  },

  signOut: async () => {
    try {
      await api("/auth/logout", { body: {}, auth: false });
    } finally {
      setAccessToken(null);
    }
  },
};

export { AuthError, initialsOf } from "./session";
export type { SessionUser } from "./session";
export type { AuthApi, SignInInput, SignUpInput, ResetInput } from "./types";
