const TAKA = "৳";

export function tk(amount: number): string {
  return TAKA + Math.round(amount).toLocaleString("en-IN");
}

export function tk2(amount: number): string {
  return (
    TAKA +
    Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function grouped(amount: number): string {
  return Math.round(amount).toLocaleString("en-IN");
}

export function compactTk(amount: number): string {
  if (amount >= 100_000) return `${TAKA}${(amount / 100_000).toFixed(1)}L`;
  if (amount >= 1_000) return `${TAKA}${(amount / 1_000).toFixed(1)}k`;
  return tk(amount);
}
