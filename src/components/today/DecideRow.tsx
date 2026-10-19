"use client";

import Link from "next/link";
import type { EnrichedBatch } from "@/domain";
import { Chip, StatusChip } from "@/components/ui/Chip";
import { ShelfLifeBar } from "@/components/viz/ShelfLifeBar";
import { recVar } from "@/lib/colors";
import { useBatchAction } from "@/lib/useBatchAction";

export function DecideRow({ batch }: { batch: EnrichedBatch }) {
  const action = useBatchAction(batch);

  return (
    <li className="flex list-none flex-col gap-2.5 border-t border-line py-3.5 first:border-t-0">
      <div className="flex flex-wrap items-start justify-between gap-2.5">
        <Link href={`/batches/${batch.id}`} className="min-w-0 no-underline text-ink">
          <span className="block text-[15.5px] font-bold">{batch.med}</span>
          <span className="num block text-[12px] text-ink-3">
            {batch.id} · {batch.left} {batch.unit} · {batch.daysText}
          </span>
        </Link>
        <StatusChip status={batch.st} label={batch.statusText} />
      </div>

      <ShelfLifeBar elapsed={batch.elapsed} cutPct={batch.cutPct} status={batch.st} />

      <div className="flex flex-wrap items-center gap-2.5">
        <p className="m-0 flex-[1_1_220px] text-[13.5px] text-ink-2 text-pretty">
          <strong style={{ color: recVar[batch.rec.kind] }}>{batch.rec.title}.</strong>{" "}
          {batch.rec.short}
        </p>

        {action ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={action.run}>
            {action.label}
          </button>
        ) : null}

        {batch.pending ? (
          <Chip color="var(--ink-3)">{batch.pendingType} awaiting approval</Chip>
        ) : null}
      </div>
    </li>
  );
}
