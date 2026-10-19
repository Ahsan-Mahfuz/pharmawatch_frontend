import { describe, expect, it } from "vitest";
import { metricBars, recallLine, weightBars } from "@/domain";

const WEIGHTS = [
  { feature: "intercept", weight: 2.4 },
  { feature: "coverage", weight: -3.4 },
  { feature: "fractionRemaining", weight: 1.1 },
  { feature: "insideFinal30Days", weight: 0.7 },
];

describe("weightBars", () => {
  it("names each feature in words a pharmacist can read", () => {
    const bars = weightBars(WEIGHTS);
    expect(bars.map((b) => b.name)).toEqual([
      "Intercept",
      "Coverage (projected sales ÷ stock)",
      "Share of batch still unsold",
      "Inside the final 30 days",
    ]);
  });

  it("signs the number so the direction is never guessed from colour alone", () => {
    const bars = weightBars(WEIGHTS);
    expect(bars[0]?.text).toBe("+2.40");
    expect(bars[1]?.text).toBe("−3.40");
  });

  it("scales the widest bar to the largest weight", () => {
    expect(weightBars(WEIGHTS)[1]?.width).toBe(100);
  });

  it("passes an unknown feature through rather than hiding it", () => {
    expect(weightBars([{ feature: "seasonality", weight: 0.5 }])[0]?.name).toBe("seasonality");
  });
});

describe("metricBars", () => {
  it("pairs every metric with the rule of thumb it has to beat", () => {
    const bars = metricBars(
      { accuracy: 0.86, precision: 0.81, recall: 0.89, f1: 0.85 },
      { accuracy: 0.71, precision: 0.63, recall: 0.52, f1: 0.57 },
    );
    expect(bars.map((b) => b.key)).toEqual(["Accuracy", "Precision", "Recall", "F1"]);
    expect(bars[2]).toEqual({ key: "Recall", value: 0.89, baseline: 0.52 });
  });

  it("reads a missing metric as zero instead of throwing", () => {
    expect(metricBars({}, {})[0]).toEqual({ key: "Accuracy", value: 0, baseline: 0 });
  });
});

describe("recallLine", () => {
  it("states both numbers and why recall is the one that matters", () => {
    const line = recallLine(0.89, 0.52, "flag any batch with fewer than 30 days left");
    expect(line).toContain("89%");
    expect(line).toContain("52%");
    expect(line).toContain("flag any batch with fewer than 30 days left");
    expect(line).toContain("a missed batch costs money");
  });
});
