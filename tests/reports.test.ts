import { describe, expect, it } from "vitest";
import {
  beyondText, enrich, liveDiscounts, monthBars, reportTotals, simView,
  supplierBars, supplierCards, toPercent,
} from "@/domain";
import { REQUESTS, SHELF, TILL } from "./fixtures";

const all = SHELF.map((b) => enrich(b, REQUESTS));
const open = all.filter((b) => !b.closed);

describe("monthBars", () => {
  it("puts expired stock in the past column", () => {
    const { bars } = monthBars(open);
    const expiredRisk = open.filter((b) => b.d < 0).reduce((a, b) => a + b.atRisk, 0);
    expect(bars[0]?.key).toBe("past");
    expect(bars[0]?.value).toBeCloseTo(expiredRisk, 6);
  });

  it("warms the nearest month and cools the far ones", () => {
    const { bars } = monthBars(open);
    expect(bars[1]?.tone).toBe("critical");
    expect(bars[bars.length - 1]?.tone).toBe("active");
  });

  it("loses nothing: every batch lands in a bar or in beyond", () => {
    const { bars, beyond } = monthBars(open);
    const total = bars.reduce((a, b) => a + b.value, 0) + beyond;
    expect(total).toBeCloseTo(open.reduce((a, b) => a + b.atRisk, 0), 6);
  });
});

describe("toPercent", () => {
  it("scales the largest value to 100", () => {
    expect(toPercent([10, 40, 20])(40)).toBe(100);
  });

  it("survives an all-zero set without dividing by zero", () => {
    expect(toPercent([0, 0])(0)).toBe(0);
  });
});

describe("beyondText", () => {
  it("names the last month shown when something sits past it", () => {
    const { bars } = monthBars(open);
    expect(beyondText(bars, 5000)).toContain(bars[bars.length - 1]!.label);
  });

  it("says nothing is further out when it is not", () => {
    expect(beyondText(monthBars(open).bars, 0)).toBe("Nothing further out is at risk.");
  });
});

describe("reportTotals", () => {
  it("counts only approved requests as money recovered or lost", () => {
    const totals = reportTotals(REQUESTS, TILL, open);
    const approved = REQUESTS.filter((a) => a.status === "approved" && a.type === "Return");
    expect(totals.returnsCount).toBe(approved.length);
    expect(totals.recovered).toBe(approved.reduce((a, x) => a + x.value, 0));
  });

  it("measures the discount given as the gap from full price", () => {
    const totals = reportTotals([], TILL, open);
    const discounted = TILL.filter((s) => (s.disc ?? 0) > 0);
    const given = discounted.reduce((a, s) => a + ((s.full ?? s.amount) - s.amount), 0);
    expect(totals.discountGiven).toBeCloseTo(given, 6);
  });
});

describe("supplierBars", () => {
  it("ranks the worst exposed supplier at full width", () => {
    const bars = supplierBars(supplierCards(all, open));
    expect(bars[0]?.percent).toBe(100);
  });
});

describe("liveDiscounts", () => {
  it("lists only batches selling below full price", () => {
    expect(liveDiscounts(open).every((d) => d.batch.discount > 0)).toBe(true);
  });
});

describe("simView", () => {
  it("runs the same model the batches do", () => {
    const view = simView({ days: 26, left: 88, qtyIn: 500, rate: 0.7 });
    expect(view.p).toBeGreaterThan(0);
    expect(view.p).toBeLessThan(1);
    expect(view.pText).toBe(view.p.toFixed(2));
  });

  it("reads healthy when stock clears well before expiry", () => {
    expect(simView({ days: 300, left: 50, qtyIn: 500, rate: 5 }).word).toBe("healthy");
  });

  it("reads act now when almost nothing will sell", () => {
    expect(simView({ days: 10, left: 500, qtyIn: 500, rate: 0.1 }).word).toBe("act now");
  });

  it("never projects more sold than is on the shelf", () => {
    expect(simView({ days: 365, left: 10, qtyIn: 500, rate: 8 }).line).toContain("leaving 0");
  });
});
