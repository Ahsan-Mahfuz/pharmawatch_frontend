import type { EnrichedBatch } from "./enrich";

const SCALE = 3.4;

export type Direction = "raises" | "lowers" | "none";

export type Factor = {
  name: string;
  hint: string;
  value: string;
  effect: number;
  width: number;
  effectText: string;
  direction: Direction;
};

function toFactor(name: string, hint: string, value: string, effect: number): Factor {
  const direction: Direction = effect > 0 ? "raises" : effect < 0 ? "lowers" : "none";
  const sign = effect > 0 ? "+" : effect < 0 ? "−" : "";
  return {
    name,
    hint,
    value,
    effect,
    width: Math.round(Math.min(100, (Math.abs(effect) / SCALE) * 100)),
    effectText: `${sign}${Math.abs(effect).toFixed(2)}`,
    direction,
  };
}

export function riskFactors(b: EnrichedBatch): Factor[] {
  const inFinal30 = b.d >= 0 && b.d <= 30;
  return [
    toFactor("Coverage", "Projected sales ÷ stock on hand", b.cov.toFixed(2), -3.4 * b.cov),
    toFactor(
      "Stock remaining",
      "Share of the batch still unsold",
      `${Math.round(b.frac * 100)}%`,
      1.1 * b.frac,
    ),
    toFactor(
      "Final 30 days",
      "Extra pressure close to expiry",
      inFinal30 ? "yes" : "no",
      inFinal30 ? 0.7 : 0,
    ),
  ];
}
