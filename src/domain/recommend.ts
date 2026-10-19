import { fd, fds } from "./dates";
import { tk } from "./money";
import type { Batch } from "./types";

export type RecKind = "none" | "writeoff" | "return" | "discount" | "watch" | "keep";

export type Recommendation = {
  kind: RecKind;
  title: string;
  text: string;
  short: string;
  label?: string;
  pct?: number;
};

export type RecInput = {
  d: number;
  c: number;
  p: number;
  unsold: number;
  atRisk: number;
  closed: boolean;
};

export function discountTier(p: number): number {
  if (p >= 0.85) return 30;
  if (p >= 0.7) return 25;
  if (p >= 0.55) return 15;
  return 10;
}

export function recommend(b: Batch, x: RecInput): Recommendation {
  if (x.closed)
    return { kind: "none", title: "Closed", short: "Off the shelf.",
      text: "This batch is off the shelf. There is nothing left to decide." };

  if (x.d < 0)
    return { kind: "writeoff", title: "Write off", label: "Request write-off",
      text: `Expired on ${fd(b.expiry)} and blocked at the counter. Request a write-off so the shelf count stays true.`,
      short: `Expired on ${fds(b.expiry)} and blocked at the counter.` };

  if (x.p >= 0.4 && x.d <= 120) {
    if (x.c >= 0)
      return { kind: "return", title: "Return to supplier", label: "Request return",
        text: `${b.sup} accepts returns until ${fd(b.cutoff)}. Sending back all ${b.left} ${b.unit} recovers ${tk(b.left * b.cost)} at cost.`,
        short: `${b.sup} takes it back until ${fds(b.cutoff)}, recovering ${tk(b.left * b.cost)}.` };

    const pct = discountTier(x.p);
    if (pct > (b.discount || 0))
      return { kind: "discount", pct, label: `Apply ${pct}% off`,
        title: `${b.discount ? "Raise the discount to " : "Discount "}${pct}%`,
        text: `At this pace about ${b.left - x.unsold} of ${b.left} ${b.unit} will sell, leaving ${x.unsold} (${tk(x.atRisk)}) to expire. Returns closed on ${fd(b.cutoff)}, so a price cut is the best recovery left.`,
        short: `About ${x.unsold} ${b.unit} (${tk(x.atRisk)}) would expire on the shelf.` };

    return { kind: "watch", title: "Hold the discount",
      text: `A ${b.discount}% discount is already live. Give it a week of sales before cutting further.`,
      short: `${b.discount}% off is live. Give it a week.` };
  }

  if (x.p >= 0.4)
    return { kind: "watch", title: "Watch",
      text: `Selling slower than it should, but ${x.d} days remain. The score is checked again every night.`,
      short: `${x.d} days remain, rechecked nightly.` };

  return { kind: "keep", title: "Keep selling", short: "On pace to sell out.",
    text: `On pace to clear ${b.left} ${b.unit} before expiry. No action needed.` };
}
