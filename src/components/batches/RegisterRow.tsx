"use client";

import { useRouter } from "next/navigation";
import type { EnrichedBatch } from "@/domain";
import { StatusChip } from "@/components/ui/Chip";
import { BlisterStrip } from "@/components/viz/BlisterStrip";
import { ShelfLifeBar } from "@/components/viz/ShelfLifeBar";
import { bandVar } from "@/lib/colors";

export function RegisterRow({ batch }: { batch: EnrichedBatch }) {
  const router = useRouter();

  return (
    <button
      type="button"
      className="brow bgrid"
      onClick={() => router.push(`/batches/${batch.id}`)}
    >
      <span className="min-w-0">
        <span className="block truncate text-[14.5px] font-bold">{batch.med}</span>
        <span className="num block truncate text-[11.5px] text-ink-3">
          {batch.id} · {batch.gen}
        </span>
      </span>

      <span className="truncate text-[13.5px] text-ink-2">{batch.sup}</span>

      <span className="flex flex-col gap-1.5">
        <BlisterStrip filled={batch.filled} status={batch.st} />
        <span className="num text-[12px] text-ink-2">
          {batch.left} {batch.unit}
        </span>
      </span>

      <span className="flex items-center gap-2.5">
        <span className="flex-1">
          <ShelfLifeBar elapsed={batch.elapsed} cutPct={batch.cutPct} status={batch.st} />
        </span>
        <span className="num min-w-[62px] text-right text-[12px] text-ink-2">
          {batch.daysText}
        </span>
      </span>

      <span className="num text-[14px] font-bold" style={{ color: bandVar[batch.band] }}>
        {batch.closed ? "0.00" : batch.p.toFixed(2)}
      </span>

      <span>
        <StatusChip status={batch.st} label={batch.statusText} />
      </span>

      <span
        className="num text-right font-semibold"
        style={{ color: batch.atRisk > 0 ? "var(--ink)" : "var(--ink-3)" }}
      >
        {batch.atRiskText}
      </span>
    </button>
  );
}
