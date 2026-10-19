import type { SessionUser } from "./session";

export type SignInInput = { email: string; password: string; remember: boolean };
export type SignUpInput = {
  name: string; pharmacy: string; email: string; password: string;
};
export type ResetInput = { token: string; password: string };

export type AuthApi = {
  signIn(input: SignInInput): Promise<SessionUser>;
  signUp(input: SignUpInput): Promise<SessionUser>;
  requestReset(input: { email: string }): Promise<{ sent: true; devToken?: string }>;
  resetPassword(input: ResetInput): Promise<{ ok: true }>;
  restore(): Promise<SessionUser | null>;
  signOut(): Promise<void>;
};
