import { MONTHS, getToday } from "./dates";
import { compactTk, tk, tk2 } from "./money";
import type { EnrichedBatch } from "./enrich";
import type { Approval, Sale } from "./types";

export type BarTone = "expired" | "critical" | "near" | "active";

export type MonthBar = { key: string; label: string; tone: BarTone; value: number };

function monthIndex(iso: string): number {
  const [y, m] = iso.split("-").map(Number);
  return (y ?? 0) * 12 + ((m ?? 1) - 1);
}

export function monthBars(
  open: readonly EnrichedBatch[],
  months = 6,
): { bars: MonthBar[]; beyond: number } {
  const base = monthIndex(getToday());
  const bars: MonthBar[] = [
    { key: "past", label: "Past", tone: "expired", value: 0 },
  ];

  for (let i = 0; i < months; i++) {
    bars.push({
      key: String(base + i),
      label: MONTHS[(base + i) % 12]!,
      tone: i === 0 ? "critical" : i <= 2 ? "near" : "active",
      value: 0,
    });
  }

  let beyond = 0;
  open.forEach((b) => {
    if (b.d < 0) {
      bars[0]!.value += b.atRisk;
      return;
    }
    const idx = monthIndex(b.expiry) - base;
    if (idx >= 0 && idx < months) bars[idx + 1]!.value += b.atRisk;
    else beyond += b.atRisk;
  });

  return { bars, beyond };
}

export function toPercent(values: readonly number[]): (v: number) => number {
  const max = Math.max(1, ...values);
  return (v) => Math.round((v / max) * 100);
}

export type ReportTotals = {
  recovered: number;
  returnsCount: number;
  writtenOff: number;
  writeOffCount: number;
  discountSales: number;
  discountGiven: number;
  risk90: number;
};

export function reportTotals(
  approvals: readonly Approval[],
  sales: readonly Sale[],
  open: readonly EnrichedBatch[],
): ReportTotals {
  const approvedOf = (type: Approval["type"]) =>
    approvals.filter((a) => a.status === "approved" && a.type === type);

  const returns = approvedOf("Return");
  const writeOffs = approvedOf("Write-off");
  const discounted = sales.filter((x) => (x.disc ?? 0) > 0);

  return {
    recovered: returns.reduce((a, x) => a + x.value, 0),
    returnsCount: returns.length,
    writtenOff: writeOffs.reduce((a, x) => a + x.value, 0),
    writeOffCount: writeOffs.length,
    discountSales: discounted.reduce((a, x) => a + x.amount, 0),
    discountGiven: discounted.reduce((a, x) => a + ((x.full ?? x.amount) - x.amount), 0),
    risk90: open.filter((b) => b.d <= 90).reduce((a, b) => a + b.atRisk, 0),
  };
}

export function beyondText(bars: readonly MonthBar[], beyond: number): string {
  const last = bars[bars.length - 1]?.label ?? "the chart";
  return beyond > 0
    ? `${compactTk(beyond)} more is at risk in batches expiring after ${last}.`
    : "Nothing further out is at risk.";
}

export type SupplierBar = { name: string; percent: number; valueText: string };

export function supplierBars(
  cards: readonly { name: string; atRisk: number }[],
): SupplierBar[] {
  const pct = toPercent(cards.map((c) => c.atRisk));
  return cards.map((c) => ({
    name: c.name,
    percent: pct(c.atRisk),
    valueText: c.atRisk > 0 ? compactTk(c.atRisk) : tk(0),
  }));
}

export type LiveDiscount = {
  batch: EnrichedBatch;
  pctText: string;
  priceText: string;
  leftText: string;
};

export function liveDiscounts(open: readonly EnrichedBatch[]): LiveDiscount[] {
  return open
    .filter((b) => b.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .map((batch) => ({
      batch,
      pctText: `${batch.discount}% off`,
      priceText: `${batch.priceText} (was ${tk2(batch.price)})`,
      leftText: `${batch.left} ${batch.unit}`,
    }));
}
