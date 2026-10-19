import type { Band, Batch } from "./types";

export function sellRate(b: Pick<Batch, "r30" | "r7" | "discount">): number {
  return (0.6 * b.r30 + 0.4 * b.r7) * (1 + (b.discount || 0) / 25);
}

export type Score = { p: number; cov: number; frac: number };

export function score(d: number, left: number, qtyIn: number, rate: number): Score {
  if (left <= 0) return { p: 0, cov: 0, frac: 0 };

  const frac = Math.min(1, left / qtyIn);
  const cov = Math.min(2, (rate * Math.max(d, 0)) / left);

  if (d < 0) return { p: 1, cov, frac };

  const z = 2.4 - 3.4 * cov + 1.1 * frac + (d <= 30 ? 0.7 : 0);
  return { p: 1 / (1 + Math.exp(-z)), cov, frac };
}

export function expectedUnsold(d: number, left: number, rate: number): number {
  if (left <= 0) return 0;
  if (d < 0) return left;
  return Math.max(0, Math.round(left - rate * Math.max(d, 0)));
}

export function bandOf(p: number, closed: boolean): Band {
  if (closed) return "No";
  if (p >= 0.7) return "High";
  if (p >= 0.4) return "Medium";
  return "Low";
}
