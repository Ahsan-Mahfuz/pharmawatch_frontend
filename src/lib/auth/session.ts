import type { Role } from "@/domain";
import type { WireAccount } from "@/lib/api/wire";

export { ApiError as AuthError } from "@/lib/api/error";

export type SessionUser = {
  id: string;
  name: string;
  first: string;
  initials: string;
  email: string;
  role: Role;
  pharmacy: string;
};

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase();
}

export function toSessionUser(account: WireAccount): SessionUser {
  return {
    ...account,
    first: account.name.trim().split(/\s+/)[0] ?? account.name,
    initials: initialsOf(account.name),
  };
}
