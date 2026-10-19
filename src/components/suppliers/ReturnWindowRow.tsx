"use client";

import Link from "next/link";
import type { ReturnWindow } from "@/domain";
import { Chip } from "@/components/ui/Chip";
import { urgencyVar } from "@/lib/colors";
import { requestAction } from "@/store/pharmacy.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBusy } from "@/store/selectors";

export function ReturnWindowRow({ window: w }: { window: ReturnWindow }) {
  const dispatch = useAppDispatch();
  const busy = useAppSelector(selectBusy);
  const { batch: b } = w;
  const color = urgencyVar[w.urgency];

  return (
    <li className="flex list-none flex-wrap items-center gap-4 border-t border-line py-3.5">
      <span
        className="flex-none rounded-[14px] px-1.5 py-2 text-center [width:84px]"
        style={{ background: `color-mix(in srgb, ${color} 10%, transparent)`, color }}
      >
        <span className="num block font-display text-[30px] leading-none font-[750]">{b.c}</span>
        <span className="eyebrow block">days left</span>
      </span>

      <span className="min-w-0 flex-[1_1_260px]">
        <span className="block truncate font-bold">
          {b.med} <span className="num font-normal text-ink-3">{b.id}</span>
        </span>
        <span className="block text-[12.5px] text-ink-3">
          {b.sup} · window closes {b.cutoffText} · {b.left} {b.unit} · {w.valueText} at cost ·
          risk {b.p.toFixed(2)}
        </span>
      </span>

      <span className="flex flex-wrap items-center gap-2">
        <Link href={`/batches/${b.id}`} className="btn btn-quiet btn-sm"
          aria-label={`Open ${b.med} ${b.id}`}>
          Open
        </Link>

        {b.pending ? (
          <Chip color="var(--ink-3)">{b.pendingType} awaiting approval</Chip>
        ) : (
          <button type="button" className="btn btn-sm" disabled={busy}
            onClick={() => void dispatch(requestAction({ ref: b.ref, id: b.id, type: "Return" }))}>
            Request return
          </button>
        )}
      </span>
    </li>
  );
}
