import { describe, expect, it } from "vitest";
import { enrich, fefoBreakdown, fefoPick, isSellable } from "@/domain";
import type { Batch } from "@/domain";
import { SHELF } from "./fixtures";

const all = SHELF.map((b) => enrich(b, []));
const napa = "Napa Extra 500mg";

describe("isSellable", () => {
  it("blocks expired stock", () => {
    const expired = all.find((b) => b.id === "MXP-3390")!;
    expect(expired.d).toBeLessThan(0);
    expect(isSellable(expired)).toBe(false);
  });

  it("allows a healthy open batch", () => {
    expect(isSellable(all.find((b) => b.id === "CEF-7741")!)).toBe(true);
  });

  it("blocks a batch that has left the shelf", () => {
    const closed = enrich({ ...(SHELF[2] as Batch), state: "returned" }, []);
    expect(isSellable(closed)).toBe(false);
  });
});

describe("fefoPick", () => {
  it("sells the earliest expiring batch, not the newest", () => {
    const pick = fefoPick(all, napa);
    expect(pick?.id).toBe("NPX-4417");
  });

  it("returns nothing when every batch of a medicine is blocked", () => {
    const expiredOnly = all.filter((b) => b.med === "Maxpro 20mg");
    expect(fefoPick(expiredOnly, "Maxpro 20mg")).toBeUndefined();
  });
});

describe("fefoBreakdown", () => {
  it("explains each batch's place in the queue", () => {
    const rows = fefoBreakdown(all, napa);
    expect(rows.map((r) => r.batch.id)).toEqual(["NPX-4417", "NPX-5102", "NPX-5533"]);
    expect(rows.map((r) => r.role)).toEqual(["sells-first", "waits", "waits"]);
  });

  it("marks expired stock as blocked", () => {
    const rows = fefoBreakdown(all, "Seclo 20mg");
    const blocked = rows.find((r) => r.batch.id === "SEC-1180");
    expect(blocked?.role).toBe("blocked");
  });
});
