import type { EnrichedBatch } from "./enrich";
import { isSellable } from "./fefo";
import { uniqueMedicines } from "./select";

export type CounterRow = {
  med: string;
  gen: string;
  unit: string;
  available: number;
  next?: EnrichedBatch;
};

type Reserved = (batchId: string) => number;

const free = (b: EnrichedBatch, reserved: Reserved) => b.left - reserved(b.id);

export function counterRows(
  all: readonly EnrichedBatch[],
  reserved: Reserved,
  query = "",
): CounterRow[] {
  const needle = query.trim().toLowerCase();

  return uniqueMedicines(all)
    .filter(
      (med) =>
        !needle ||
        med.toLowerCase().includes(needle) ||
        all.some((b) => b.med === med && b.gen.toLowerCase().includes(needle)),
    )
    .map((med) => {
      const mine = ofMedicine(all, med);
      const sellable = mine.filter((b) => isSellable(b) && free(b, reserved) > 0);

      return {
        med,
        gen: mine[0]?.gen ?? "",
        unit: mine[0]?.unit ?? "units",
        available: sellable.reduce((a, b) => a + free(b, reserved), 0),
        next: sellable[0],
      };
    });
}

export type CounterRole = "sells-first" | "waits" | "in-cart" | "blocked" | "closed";

export type QueueEntry = {
  batch: EnrichedBatch;
  role: CounterRole;
  label: string;
  line: string;
};

const ROLE_TEXT: Record<Exclude<CounterRole, "closed">, string> = {
  "sells-first": "Sells first",
  waits: "Waits its turn",
  "in-cart": "All in cart",
  blocked: "Expired · blocked",
};

export function counterQueue(
  all: readonly EnrichedBatch[],
  reserved: Reserved,
  med: string,
): QueueEntry[] {
  const mine = ofMedicine(all, med);
  const first = mine.find((b) => isSellable(b) && free(b, reserved) > 0);

  return mine.map((batch) => {
    const held = reserved(batch.id);
    const role = roleOf(batch, first?.id, free(batch, reserved));
    return {
      batch,
      role,
      label: role === "closed" ? batch.statusText : ROLE_TEXT[role],
      line:
        `exp ${batch.expiryText} · ${batch.left} left` +
        (held > 0 ? ` · ${held} in cart` : ""),
    };
  });
}

function roleOf(b: EnrichedBatch, firstId: string | undefined, spare: number): CounterRole {
  if (b.closed) return "closed";
  if (b.d < 0) return "blocked";
  if (b.id === firstId) return "sells-first";
  return spare <= 0 ? "in-cart" : "waits";
}

export function fefoNote(all: readonly EnrichedBatch[], med: string): string {
  const mine = ofMedicine(all, med);
  const first = mine.find(isSellable);
  const blocked = mine.filter((b) => !b.closed && b.d < 0);

  const lead = first
    ? `${first.id} expires first (${first.expiryText}), so the counter sells it before newer stock.`
    : "Nothing of this medicine can be sold right now.";

  return blocked.length
    ? `${lead} ${blocked.map((b) => b.id).join(", ")} expired and is blocked from sale.`
    : lead;
}

export function cartSummary(units: number, lines: number): string {
  return `${units} ${units === 1 ? "unit" : "units"} · ${lines} ${lines === 1 ? "line" : "lines"}`;
}

const ofMedicine = (all: readonly EnrichedBatch[], med: string) =>
  all.filter((b) => b.med === med).sort((a, b) => a.d - b.d);
