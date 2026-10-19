import { describe, expect, it } from "vitest";
import { counterQueue, counterRows, enrich, fefoNote } from "@/domain";
import { SHELF } from "./fixtures";

const all = SHELF.map((b) => enrich(b, []));
const napa = "Napa Extra 500mg";
const none = () => 0;

describe("counterRows", () => {
  it("offers the earliest expiring sellable batch, not the newest", () => {
    const row = counterRows(all, none).find((r) => r.med === napa);
    expect(row?.next?.id).toBe("NPX-4417");
  });

  it("counts only stock that is free to sell", () => {
    const expected = all
      .filter((b) => b.med === napa && b.d >= 0 && !b.closed)
      .reduce((a, b) => a + b.left, 0);
    expect(counterRows(all, none).find((r) => r.med === napa)?.available).toBe(expected);
  });

  it("subtracts what is already in the cart", () => {
    const base = counterRows(all, none).find((r) => r.med === napa)!.available;
    const held = counterRows(all, (id) => (id === "NPX-4417" ? 5 : 0));
    expect(held.find((r) => r.med === napa)?.available).toBe(base - 5);
  });

  it("moves to the next batch once the first is fully reserved", () => {
    const first = all.find((b) => b.id === "NPX-4417")!;
    const rows = counterRows(all, (id) => (id === "NPX-4417" ? first.left : 0));
    expect(rows.find((r) => r.med === napa)?.next?.id).toBe("NPX-5102");
  });

  it("matches on the generic name as well as the brand", () => {
    const byGeneric = counterRows(all, none, all[1]!.gen);
    expect(byGeneric.length).toBeGreaterThan(0);
  });

  it("offers no batch when every one of a medicine has expired", () => {
    const row = counterRows(all, none).find((r) => r.med === "Maxpro 20mg");
    expect(row?.next).toBeUndefined();
    expect(row?.available).toBe(0);
  });
});

describe("counterQueue", () => {
  it("names one batch as selling first and the rest as waiting", () => {
    const roles = counterQueue(all, none, napa).map((r) => r.role);
    expect(roles).toEqual(["sells-first", "waits", "waits"]);
  });

  it("marks a fully reserved batch as in the cart", () => {
    const first = all.find((b) => b.id === "NPX-4417")!;
    const rows = counterQueue(all, (id) => (id === "NPX-4417" ? first.left : 0), napa);
    expect(rows[0]?.role).toBe("in-cart");
    expect(rows[1]?.role).toBe("sells-first");
  });

  it("blocks expired stock from ever being next", () => {
    const rows = counterQueue(all, none, "Seclo 20mg");
    expect(rows.find((r) => r.batch.id === "SEC-1180")?.role).toBe("blocked");
  });

  it("shows what is held in the cart on the line", () => {
    const rows = counterQueue(all, (id) => (id === "NPX-4417" ? 2 : 0), napa);
    expect(rows[0]?.line).toContain("2 in cart");
  });
});

describe("fefoNote", () => {
  it("names the batch that sells first", () => {
    expect(fefoNote(all, napa)).toContain("NPX-4417 expires first");
  });

  it("says so when nothing can be sold", () => {
    expect(fefoNote(all, "Maxpro 20mg")).toContain("Nothing of this medicine");
  });

  it("calls out expired stock that is blocked", () => {
    expect(fefoNote(all, "Seclo 20mg")).toContain("SEC-1180");
  });
});
