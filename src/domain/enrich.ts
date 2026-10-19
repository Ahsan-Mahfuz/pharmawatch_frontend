import { daysTo, fd, fds } from "./dates";
import { tk, tk2 } from "./money";
import { recommend, type Recommendation } from "./recommend";
import { bandOf, expectedUnsold, score, sellRate } from "./risk";
import { closedLabel, daysLabel, isClosed, statusLabel, statusOf } from "./status";
import type { Approval, Band, Batch, Status } from "./types";

export type EnrichedBatch = Batch & {
  d: number;
  c: number;
  closed: boolean;
  st: Status;
  statusText: string;
  daysText: string;
  p: number;
  band: Band;
  rate: number;
  cov: number;
  frac: number;
  projected: number;
  unsold: number;
  atRisk: number;
  atRiskText: string;
  pending: boolean;
  pendingType: string;
  elapsed: number;
  cutPct: number;
  filled: number;
  priceNow: number;
  priceText: string;
  expiryText: string;
  receivedText: string;
  cutoffText: string;
  expiryShort: string;
  shownQty: number;
  stockAria: string;
  rec: Recommendation;
};

export function enrich(b: Batch, approvals: readonly Approval[]): EnrichedBatch {
  const d = daysTo(b.expiry);
  const r = daysTo(b.received);
  const c = daysTo(b.cutoff);

  const span = Math.max(1, d - r);
  const elapsed = clamp((-r / span) * 100);
  const cutPct = clamp(((c - r) / span) * 100);

  const closed = isClosed(b);
  const st = statusOf(b, d);
  const rate = sellRate(b);
  const sc = score(d, b.left, b.qtyIn, rate);
  const p = closed ? 0 : sc.p;

  const unsold = closed ? 0 : expectedUnsold(d, b.left, rate);
  const atRisk = unsold * b.cost;
  const priceNow = b.price * (1 - (b.discount || 0) / 100);
  const pendingReq = approvals.find((a) => a.batchId === b.id && a.status === "pending");
  const shownQty = closed && b.closedQty ? b.closedQty : b.left;

  return {
    ...b,
    d, c, closed, st, p, rate, cov: sc.cov, frac: sc.frac,
    statusText: statusLabel(st, b.state),
    daysText: daysLabel(d, closed, b.state),
    band: bandOf(p, closed),
    projected: rate * Math.max(d, 0),
    unsold, atRisk,
    atRiskText: atRisk > 0 ? tk(atRisk) : "·",
    pending: !!pendingReq,
    pendingType: pendingReq ? pendingReq.type : "",
    elapsed, cutPct,
    filled: b.left <= 0 ? 0 : Math.max(1, Math.ceil((b.left / b.qtyIn) * 10)),
    priceNow, priceText: tk2(priceNow),
    expiryText: fd(b.expiry), receivedText: fd(b.received),
    cutoffText: fd(b.cutoff), expiryShort: fds(b.expiry),
    shownQty,
    stockAria: closed
      ? `${closedLabel(b.state)} · ${shownQty} ${b.unit} taken off the shelf`
      : `${b.left} of ${b.qtyIn} ${b.unit} still on the shelf`,
    rec: recommend(b, { d, c, p, unsold, atRisk, closed }),
  };
}

const clamp = (n: number) => Math.min(100, Math.max(0, n));
