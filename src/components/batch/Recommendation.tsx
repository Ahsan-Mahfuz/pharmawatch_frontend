"use client";

import type { EnrichedBatch } from "@/domain";
import { Card, CardHead } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { recVar } from "@/lib/colors";
import { requestAction } from "@/store/pharmacy.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBusy } from "@/store/selectors";
import { DiscountPicker } from "./DiscountPicker";

export function Recommendation({ batch }: { batch: EnrichedBatch }) {
  const dispatch = useAppDispatch();
  const busy = useAppSelector(selectBusy);
  const color = recVar[batch.rec.kind];
  const at = { ref: batch.ref, id: batch.id };

  const returnBlocked = batch.closed || batch.pending || batch.c < 0 || busy;
  const returnWhy = batch.closed
    ? "This batch is closed."
    : batch.c < 0
      ? `The return window closed on ${batch.cutoffText}.`
      : `${batch.sup} accepts returns until ${batch.cutoffText}.`;

  return (
    <Card>
      <CardHead
        title="What to do"
        right={batch.pending ? <Chip color="var(--ink-3)">{batch.pendingType} awaiting approval</Chip> : null}
      />

      <div className="flex flex-col gap-4 px-[22px] pb-[22px] max-sm:px-4">
        <div
          className="rounded-inner border p-4"
          style={{ borderColor: color, background: `color-mix(in srgb, ${color} 8%, transparent)` }}
        >
          <p className="h3 m-0" style={{ color }}>
            {batch.rec.title}
          </p>
          <p className="m-0 mt-1.5 text-[14px] text-ink text-pretty">{batch.rec.text}</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            className="btn"
            disabled={returnBlocked}
            title={returnWhy}
            onClick={() => void dispatch(requestAction({ ...at, type: "Return" }))}
          >
            Request supplier return
          </button>
          <button
            type="button"
            className="btn"
            disabled={batch.closed || batch.pending || busy}
            onClick={() => void dispatch(requestAction({ ...at, type: "Write-off" }))}
          >
            Request write-off
          </button>
        </div>
        <p className="m-0 text-[12.5px] text-ink-3">{returnWhy}</p>

        <hr className="border-0 border-t border-dashed border-line" />

        <DiscountPicker batch={batch} />
      </div>
    </Card>
  );
}
