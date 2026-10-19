import { fd, getToday } from "./dates";
import type { EnrichedBatch } from "./enrich";
import { decideToday } from "./select";
import type { Approval, Sale } from "./types";

export type Ledger = {
  stock: number;
  openCount: number;
  risk90: number;
  expiring30: number;
  expired: number;
  pending: number;
  pendingSub: string;
  decideCount: number;
  salesToday: number;
  salesSub: string;
};

export function todayLedger(
  open: readonly EnrichedBatch[],
  approvals: readonly Approval[],
  sales: readonly Sale[],
): Ledger {
  const pending = approvals.filter((a) => a.status === "pending");
  const today = fd(getToday());
  const todaysSales = sales.filter((s) => s.date === today);
  const invoices = new Set(todaysSales.map((s) => s.inv));

  return {
    stock: open.filter((b) => b.d >= 0).reduce((a, b) => a + b.left * b.cost, 0),
    openCount: open.length,
    risk90: open.filter((b) => b.d <= 90).reduce((a, b) => a + b.atRisk, 0),
    expiring30: open.filter((b) => b.d >= 0 && b.d <= 30).length,
    expired: open.filter((b) => b.d < 0).length,
    pending: pending.length,
    pendingSub: pending.length
      ? `oldest raised ${pending[pending.length - 1]!.date.slice(0, 6)}`
      : "queue is clear",
    decideCount: decideToday(open).length,
    salesToday: todaysSales.reduce((a, s) => a + s.amount, 0),
    salesSub: invoices.size
      ? `${invoices.size} ${invoices.size === 1 ? "invoice" : "invoices"} so far`
      : "no sales yet today",
  };
}
