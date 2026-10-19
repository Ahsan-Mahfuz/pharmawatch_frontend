"use client";

import { useAppSelector } from "@/store/hooks";
import { selectAccount } from "@/store/selectors";

export function PharmacyName({ className }: { className: string }) {
  const account = useAppSelector(selectAccount);
  return <p className={className}>{account?.pharmacy ?? " "}</p>;
}
