import type { EnrichedBatch } from "./enrich";
import { bandOf, score } from "./risk";
import type { Band } from "./types";

export type SimInput = { days: number; left: number; qtyIn: number; rate: number };

export type SimView = SimInput & {
  p: number;
  pText: string;
  band: Band;
  word: string;
  rateText: string;
  line: string;
};

export function simView(sim: SimInput): SimView {
  const { p } = score(sim.days, sim.left, sim.qtyIn, sim.rate);
  const sold = Math.min(sim.left, Math.round(sim.rate * sim.days));

  return {
    ...sim,
    p,
    pText: p.toFixed(2),
    band: bandOf(p, false),
    word: p >= 0.7 ? "act now" : p >= 0.4 ? "watch closely" : "healthy",
    rateText: sim.rate.toFixed(1),
    line:
      `At ${sim.rate.toFixed(1)} a day, about ${sold} of ${sim.left} units sell in ` +
      `${sim.days} days, leaving ${sim.left - sold} to expire.`,
  };
}

export type SimPreset = { id: string; label: string; input: SimInput };

export const PRESET_COUNT = 3;

export function simPresets(all: readonly EnrichedBatch[]): SimPreset[] {
  return all
    .filter((b) => !b.closed && b.left > 0 && b.d >= 0)
    .sort((a, b) => b.p - a.p)
    .slice(0, PRESET_COUNT)
    .map((b) => ({
      id: b.id,
      label: `${b.med.split(" ")[0]} ${b.id}`,
      input: {
        days: Math.max(1, b.d),
        left: Math.max(1, b.left),
        qtyIn: b.qtyIn,
        rate: Math.round(b.rate * 10) / 10,
      },
    }));
}

export const SIM_RANGES = [
  { key: "days", label: "Days to expiry", min: 1, max: 365, step: 1 },
  { key: "left", label: "Stock on hand", min: 1, max: 600, step: 1 },
  { key: "qtyIn", label: "Quantity received", min: 50, max: 1000, step: 10 },
  { key: "rate", label: "Units sold per day", min: 0, max: 8, step: 0.1 },
] as const;
