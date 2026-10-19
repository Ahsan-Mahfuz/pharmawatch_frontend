"use client";

import Link from "next/link";
import { useMemo } from "react";
import { StatusChip } from "@/components/ui/Chip";
import { useAppSelector } from "@/store/hooks";
import { selectBatchMap } from "@/store/selectors";
import { BatchRecord } from "./BatchRecord";
import { Movement } from "./Movement";
import { Recommendation } from "./Recommendation";
import { RiskPanel } from "./RiskPanel";
import { ShelfLifePanel } from "./ShelfLifePanel";

export function BatchDetail({ id }: { id: string }) {
  const byId = useAppSelector(selectBatchMap);
  const batch = useMemo(() => byId.get(id), [byId, id]);

  if (!batch) {
    return (
      <div className="screen py-16 text-center">
        <h1 className="h2">No batch numbered {id}</h1>
        <p className="sub mx-auto max-w-[44ch]">
          It may have been written off and cleared, or the number may be mistyped.
        </p>
        <Link href="/batches" className="btn mt-5">
          Back to the register
        </Link>
      </div>
    );
  }

  return (
    <div className="screen flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3.5">
        <div className="min-w-0">
          <Link href="/batches" className="eyebrow no-underline">
            ← The register
          </Link>
          <h1 className="h2 mt-1.5 text-[44px] max-sm:text-[30px]">{batch.med}</h1>
          <p className="sub num">
            {batch.id} · {batch.gen} · {batch.sup}
          </p>
        </div>
        <StatusChip status={batch.st} label={`${batch.statusText} · ${batch.daysText}`} />
      </div>

      <div className="grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(420px,100%),1fr))]">
        <div className="flex min-w-0 flex-col gap-5">
          <RiskPanel batch={batch} />
          <Recommendation batch={batch} />
          <Movement batchId={batch.id} />
        </div>

        <div className="flex min-w-0 flex-col gap-5">
          <ShelfLifePanel batch={batch} />
          <BatchRecord batch={batch} />
        </div>
      </div>
    </div>
  );
}
