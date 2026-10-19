"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/store/auth.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAccount } from "@/store/selectors";

export function AccountMenu() {
  const account = useAppSelector(selectAccount);
  const dispatch = useAppDispatch();
  const router = useRouter();

  if (!account) return null;

  async function leave() {
    await dispatch(signOut());
    router.replace("/signin");
  }

  return (
    <div className="flex items-center gap-2 rounded-full bg-white/[0.07] p-1 pr-1">
      <span
        className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-mint text-[11px] font-bold text-pine"
        aria-hidden="true"
      >
        {account.initials}
      </span>

      <span className="min-w-0 pr-1 leading-tight">
        <span className="block truncate text-[12.5px] font-semibold">{account.first}</span>
        <span className="block truncate font-mono text-[9.5px] tracking-[0.1em] text-on-pine-2 uppercase">
          {account.role}
        </span>
      </span>

      <button type="button" className="role" onClick={leave}>
        Sign out
      </button>
    </div>
  );
}
