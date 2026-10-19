const SCALE = 3.4;

export type WeightBar = { name: string; weight: number; width: number; text: string };

const LABELS: Record<string, string> = {
  intercept: "Intercept",
  coverage: "Coverage (projected sales ÷ stock)",
  fractionRemaining: "Share of batch still unsold",
  insideFinal30Days: "Inside the final 30 days",
};

export function weightBars(
  weights: readonly { feature: string; weight: number }[],
): WeightBar[] {
  return weights.map((w) => ({
    name: LABELS[w.feature] ?? w.feature,
    weight: w.weight,
    width: Math.round((Math.abs(w.weight) / SCALE) * 100),
    text: `${w.weight > 0 ? "+" : "−"}${Math.abs(w.weight).toFixed(2)}`,
  }));
}

export type MetricBar = { key: string; value: number; baseline: number };

export function metricBars(
  model: Record<string, number>,
  baseline: Record<string, number>,
): MetricBar[] {
  return [
    ["Accuracy", "accuracy"],
    ["Precision", "precision"],
    ["Recall", "recall"],
    ["F1", "f1"],
  ].map(([key, field]) => ({
    key: key!,
    value: model[field!] ?? 0,
    baseline: baseline[field!] ?? 0,
  }));
}

export function recallLine(model: number, baseline: number, rule: string): string {
  return (
    `The rule of thumb is what a pharmacist would do anyway: ${rule}. ` +
    `The model catches ${Math.round(model * 100)}% of batches that go on to expire ` +
    `unsold, against the rule's ${Math.round(baseline * 100)}%. Recall is favoured on ` +
    `purpose, because a missed batch costs money and a false alarm costs a few seconds.`
  );
}
