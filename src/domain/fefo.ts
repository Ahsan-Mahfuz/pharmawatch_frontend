import type { EnrichedBatch } from "./enrich";

export function isSellable(b: EnrichedBatch): boolean {
  return !b.closed && b.d >= 0 && b.left > 0;
}

export function fefoQueue(batches: readonly EnrichedBatch[], med: string): EnrichedBatch[] {
  return batches
    .filter((b) => b.med === med && isSellable(b))
    .sort((a, b) => a.d - b.d);
}

export function fefoPick(
  batches: readonly EnrichedBatch[],
  med: string,
): EnrichedBatch | undefined {
  return fefoQueue(batches, med)[0];
}

export type FefoRole = "sells-first" | "waits" | "blocked" | "closed";

export function fefoRole(b: EnrichedBatch, firstId: string | undefined): FefoRole {
  if (b.closed) return "closed";
  if (b.d < 0) return "blocked";
  return b.id === firstId ? "sells-first" : "waits";
}

export const FEFO_ROLE_TEXT: Record<FefoRole, string> = {
  "sells-first": "Sells first",
  waits: "Waits its turn",
  blocked: "Expired · blocked",
  closed: "Closed",
};

export function fefoBreakdown(
  batches: readonly EnrichedBatch[],
  med: string,
): { batch: EnrichedBatch; role: FefoRole }[] {
  const first = fefoPick(batches, med)?.id;
  return batches
    .filter((b) => b.med === med)
    .sort((a, b) => a.d - b.d)
    .map((batch) => ({ batch, role: fefoRole(batch, first) }));
}
