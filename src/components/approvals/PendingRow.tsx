"use client";

import Link from "next/link";
import type { ApprovalView } from "@/domain";
import { Chip } from "@/components/ui/Chip";
import { typeVar } from "@/lib/colors";
import { decide } from "@/store/pharmacy.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBusy } from "@/store/selectors";

export function PendingRow({ req }: { req: ApprovalView }) {
  const dispatch = useAppDispatch();
  const busy = useAppSelector(selectBusy);
  const at = { ref: req.ref, id: req.id };

  return (
    <li className="flex list-none flex-wrap items-center gap-4 border-t border-line py-4">
      <Chip color={typeVar[req.type]}>{req.type}</Chip>

      <span className="min-w-0 flex-[1_1_260px]">
        <span className="block truncate font-bold">
          {req.med} <span className="num font-normal text-ink-3">{req.batchId}</span>
        </span>
        <span className="block text-[12.5px] text-ink-3">
          {req.id} · {req.qtyText} · {req.valueText} at cost · asked by {req.by} on {req.date}
        </span>
        {req.why ? (
          <span className="mt-1 block text-[12.5px] text-st-near">{req.why}</span>
        ) : null}
      </span>

      <span className="flex flex-wrap gap-2">
        <Link href={`/batches/${req.batchId}`} className="btn btn-quiet btn-sm">
          View batch
        </Link>
        <button type="button" className="btn btn-sm" disabled={!req.can || busy}
          onClick={() => void dispatch(decide({ ...at, approve: false }))}>
          Reject
        </button>
        <button type="button" className="btn btn-primary btn-sm" disabled={!req.can || busy}
          onClick={() => void dispatch(decide({ ...at, approve: true }))}>
          Approve
        </button>
      </span>
    </li>
  );
}
