import { describe, expect, it } from "vitest";
import { closedLabel, daysLabel, isClosed, statusOf } from "@/domain";
import type { Batch } from "@/domain";

const open = { state: "open", left: 10 } as Pick<Batch, "state" | "left">;

describe("statusOf", () => {
  it.each([
    [91, "active"],
    [90, "near"],
    [31, "near"],
    [30, "critical"],
    [1, "critical"],
    [0, "critical"],
    [-1, "expired"],
  ])("with %i days left is %s", (days, expected) => {
    expect(statusOf(open, days)).toBe(expected);
  });

  it("treats a returned batch as closed even with days left", () => {
    expect(statusOf({ state: "returned", left: 40 }, 200)).toBe("closed");
  });

  it("treats an empty shelf as closed even while open", () => {
    expect(statusOf({ state: "open", left: 0 }, 200)).toBe("closed");
  });
});

describe("isClosed", () => {
  it("is false only for an open batch with stock", () => {
    expect(isClosed({ state: "open", left: 1 })).toBe(false);
    expect(isClosed({ state: "open", left: 0 })).toBe(true);
    expect(isClosed({ state: "written-off", left: 5 })).toBe(true);
  });
});

describe("closedLabel", () => {
  it("names how the batch left the shelf", () => {
    expect(closedLabel("returned")).toBe("Returned");
    expect(closedLabel("written-off")).toBe("Written off");
    expect(closedLabel("open")).toBe("Sold out");
  });
});

describe("daysLabel", () => {
  it("reads naturally on both sides of expiry", () => {
    expect(daysLabel(27, false, "open")).toBe("27d left");
    expect(daysLabel(0, false, "open")).toBe("today");
    expect(daysLabel(-18, false, "open")).toBe("18d ago");
    expect(daysLabel(-18, true, "written-off")).toBe("Written off");
  });
});
