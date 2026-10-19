"use client";

import { useRouter } from "next/navigation";
import { roleBanner } from "@/domain";
import { signOut } from "@/store/auth.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAccount, selectRole } from "@/store/selectors";

export function RoleBanner() {
  const role = useAppSelector(selectRole);
  const account = useAppSelector(selectAccount);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function swap() {
    await dispatch(signOut());
    router.replace("/signin");
  }

  if (!account) return null;

  return (
    <div className="flex flex-wrap items-center gap-3.5 rounded-panel border border-dashed border-line-2 bg-paper px-[18px] py-3.5">
      <span
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-pine text-[12px] font-bold text-mint"
        aria-hidden="true"
      >
        {account.initials}
      </span>

      <p className="m-0 flex-[1_1_300px] text-[14px] text-pretty">{roleBanner(role, account.name)}</p>

      <button type="button" className="btn btn-sm" onClick={swap}>
        Switch account
      </button>
    </div>
  );
}
