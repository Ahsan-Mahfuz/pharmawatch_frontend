"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, isCurrent, type NavItem } from "@/lib/nav";
import { useAppSelector } from "@/store/hooks";
import { selectCartUnits, selectPendingApprovals } from "@/store/selectors";

function Badge({ count, noun }: { count: number; noun: string }) {
  if (count <= 0) return null;
  return (
    <span className="num relative inline-flex h-5 min-w-[22px] items-center justify-center rounded-full bg-mint px-1.5 text-[11px] font-bold text-[#04130D]">
      <span aria-hidden="true">{count}</span>
      <span className="sr">
        {count} {noun}
      </span>
    </span>
  );
}

const NOUN = { cart: "units in the cart", pending: "waiting for approval", none: "" } as const;

export function Tabs() {
  const pathname = usePathname();
  const cart = useAppSelector(selectCartUnits);
  const pending = useAppSelector(selectPendingApprovals).length;

  const countFor = (item: NavItem) =>
    item.badge === "cart" ? cart : item.badge === "pending" ? pending : 0;

  return (
    <nav aria-label="Main" className="flex gap-1 overflow-x-auto">
      {NAV.map((item) => {
        const current = isCurrent(item.href, pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="tab"
            aria-current={current ? "page" : undefined}
          >
            <span className="num text-[10.5px] opacity-65">{item.idx}</span>
            <span>{item.label}</span>
            <Badge count={countFor(item)} noun={NOUN[item.badge]} />
          </Link>
        );
      })}
    </nav>
  );
}
