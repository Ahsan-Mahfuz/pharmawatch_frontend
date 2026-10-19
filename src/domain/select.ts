import type { EnrichedBatch } from "./enrich";

export type StatusFilter = "shelf" | "action" | "expired" | "closed";
export type SortKey = "days" | "risk" | "value" | "name";

export const needsAction = (b: EnrichedBatch): boolean =>
  !b.closed && (b.d < 0 || (b.p >= 0.4 && b.d <= 120));

export const SEGMENTS: {
  key: StatusFilter;
  label: string;
  match: (b: EnrichedBatch) => boolean;
}[] = [
  { key: "shelf", label: "On shelf", match: (b) => !b.closed },
  { key: "action", label: "Needs action", match: needsAction },
  { key: "expired", label: "Expired", match: (b) => b.st === "expired" },
  { key: "closed", label: "Closed", match: (b) => b.closed },
];

export const SORTERS: Record<SortKey, (a: EnrichedBatch, b: EnrichedBatch) => number> = {
  days: (a, b) => a.d - b.d,
  risk: (a, b) => b.p - a.p || a.d - b.d,
  value: (a, b) => b.atRisk - a.atRisk || a.d - b.d,
  name: (a, b) => (a.med < b.med ? -1 : a.med > b.med ? 1 : a.d - b.d),
};

export const SORT_NAMES: Record<SortKey, string> = {
  days: "days left",
  risk: "risk score",
  value: "value at risk",
  name: "name",
};

export const ALL_SUPPLIERS = "All suppliers";

export function searchBatches(
  list: readonly EnrichedBatch[],
  q: string,
  supplier: string,
): EnrichedBatch[] {
  const needle = q.trim().toLowerCase();
  return list.filter(
    (b) =>
      (!needle || `${b.med} ${b.gen} ${b.id}`.toLowerCase().includes(needle)) &&
      (supplier === ALL_SUPPLIERS || b.sup === supplier),
  );
}

export function segmentOf(key: StatusFilter) {
  return SEGMENTS.find((s) => s.key === key) ?? SEGMENTS[0]!;
}

export function sortBatches(list: readonly EnrichedBatch[], sort: SortKey): EnrichedBatch[] {
  return [...list].sort(SORTERS[sort] ?? SORTERS.days);
}

export function decideToday(open: readonly EnrichedBatch[]): EnrichedBatch[] {
  return open
    .filter((b) => b.d < 0 || (b.p >= 0.55 && b.d <= 120))
    .sort(
      (a, b) =>
        (a.pending ? 1 : 0) - (b.pending ? 1 : 0) || b.p - a.p || a.d - b.d,
    );
}

export function uniqueSuppliers(list: readonly { sup: string }[]): string[] {
  return [...new Set(list.map((b) => b.sup))];
}

export function uniqueMedicines(list: readonly { med: string }[]): string[] {
  return [...new Set(list.map((b) => b.med))].sort();
}
