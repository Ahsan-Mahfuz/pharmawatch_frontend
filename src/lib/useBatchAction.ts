"use client";

import type { EnrichedBatch } from "@/domain";
import { applyDiscount, requestAction } from "@/store/pharmacy.thunks";
import { useAppDispatch } from "@/store/hooks";

export function useBatchAction(b: EnrichedBatch): { label: string; run: () => void } | null {
  const dispatch = useAppDispatch();

  if (b.pending || !b.rec.label) return null;

  const { kind, pct } = b.rec;

  return {
    label: b.rec.label,
    run: () => {
      const at = { ref: b.ref, id: b.id };
      if (kind === "discount" && pct) void dispatch(applyDiscount({ ...at, pct }));
      else if (kind === "return") void dispatch(requestAction({ ...at, type: "Return" }));
      else if (kind === "writeoff") void dispatch(requestAction({ ...at, type: "Write-off" }));
    },
  };
}
