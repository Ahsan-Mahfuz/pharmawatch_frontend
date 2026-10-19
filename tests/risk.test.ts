import { describe, expect, it } from "vitest";
import { bandOf, expectedUnsold, score, sellRate } from "@/domain";

describe("sellRate", () => {
  it("weights the 30 day rate above the 7 day rate", () => {
    expect(sellRate({ r30: 1, r7: 0, discount: 0 })).toBeCloseTo(0.6, 5);
    expect(sellRate({ r30: 0, r7: 1, discount: 0 })).toBeCloseTo(0.4, 5);
  });

  it("speeds up sales when a discount is live", () => {
    const plain = sellRate({ r30: 1, r7: 1, discount: 0 });
    const cut = sellRate({ r30: 1, r7: 1, discount: 25 });
    expect(cut).toBeCloseTo(plain * 2, 5);
  });
});

describe("score", () => {
  it("returns certainty for an expired batch with stock left", () => {
    expect(score(-5, 50, 100, 1).p).toBe(1);
  });

  it("returns no risk once the shelf is empty, even past expiry", () => {
    expect(score(-5, 0, 100, 1).p).toBe(0);
  });

  it("caps coverage at 2 so a fast seller cannot skew the sum", () => {
    expect(score(900, 10, 100, 5).cov).toBe(2);
  });

  it("falls as coverage rises", () => {
    const slow = score(60, 100, 200, 0.2).p;
    const fast = score(60, 100, 200, 3).p;
    expect(fast).toBeLessThan(slow);
  });

  it("adds pressure inside the final 30 days", () => {
    const outside = score(31, 100, 200, 1);
    const inside = score(30, 100, 200, 1);
    expect(inside.p).toBeGreaterThan(outside.p);
  });

  it("stays a probability", () => {
    for (const d of [0, 1, 30, 120, 400]) {
      const { p } = score(d, 80, 500, 0.7);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    }
  });
});

describe("expectedUnsold", () => {
  it("writes off the whole remainder once expired", () => {
    expect(expectedUnsold(-1, 64, 2)).toBe(64);
  });

  it("is what the pace will not clear", () => {
    expect(expectedUnsold(27, 88, 0.9)).toBe(64);
  });

  it("never goes negative when the batch will sell out", () => {
    expect(expectedUnsold(100, 10, 5)).toBe(0);
  });
});

describe("bandOf", () => {
  it("splits at 0.70 and 0.40", () => {
    expect(bandOf(0.7, false)).toBe("High");
    expect(bandOf(0.69, false)).toBe("Medium");
    expect(bandOf(0.4, false)).toBe("Medium");
    expect(bandOf(0.39, false)).toBe("Low");
    expect(bandOf(0.99, true)).toBe("No");
  });
});
