import { fds } from "./dates";
import type { EnrichedBatch } from "./enrich";
import { tk } from "./money";
import { uniqueSuppliers } from "./select";

export type Urgency = "expired" | "critical" | "near";

export function urgencyOf(daysToCutoff: number): Urgency {
  if (daysToCutoff <= 14) return "expired";
  if (daysToCutoff <= 30) return "critical";
  return "near";
}

export type ReturnWindow = {
  batch: EnrichedBatch;
  urgency: Urgency;
  value: number;
  valueText: string;
};

export function closingWindows(
  open: readonly EnrichedBatch[],
  withinDays = 45,
): ReturnWindow[] {
  return open
    .filter((b) => b.d >= 0 && b.c >= 0 && b.c <= withinDays)
    .sort((a, b) => a.c - b.c)
    .map((batch) => {
      const value = batch.left * batch.cost;
      return { batch, urgency: urgencyOf(batch.c), value, valueText: tk(value) };
    });
}

export type SupplierCard = {
  name: string;
  openBatches: EnrichedBatch[];
  countText: string;
  avgRisk: number;
  avgText: string;
  stockValue: number;
  atRisk: number;
  nextCutoffText: string;
};

export function supplierCards(
  all: readonly EnrichedBatch[],
  open: readonly EnrichedBatch[],
): SupplierCard[] {
  return uniqueSuppliers(all)
    .map((name) => {
      const mine = open
        .filter((b) => b.sup === name)
        .sort((a, b) => (a.expiry < b.expiry ? -1 : 1));
      const total = all.filter((b) => b.sup === name).length;
      const avgRisk = mine.length
        ? mine.reduce((a, b) => a + b.p, 0) / mine.length
        : 0;
      const next = mine.filter((b) => b.c >= 0).sort((a, b) => a.c - b.c)[0];
      const closed = total - mine.length;

      return {
        name,
        openBatches: mine,
        countText:
          `${mine.length} open ${mine.length === 1 ? "batch" : "batches"}` +
          (closed > 0 ? ` · ${closed} closed` : ""),
        avgRisk,
        avgText: mine.length ? `avg risk ${avgRisk.toFixed(2)}` : "no open stock",
        stockValue: mine
          .filter((b) => b.d >= 0)
          .reduce((a, b) => a + b.left * b.cost, 0),
        atRisk: mine.reduce((a, b) => a + b.atRisk, 0),
        nextCutoffText: next ? fds(next.cutoff) : "none open",
      };
    })
    .sort((a, b) => b.atRisk - a.atRisk);
}
