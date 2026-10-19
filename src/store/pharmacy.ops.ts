import { daysTo } from "@/domain";
import type { Batch } from "@/domain";
import type { CartLine } from "./pharmacy.slice";

export function nextSellable(
  batches: readonly Batch[],
  cart: readonly CartLine[],
  med: string,
): Batch | undefined {
  const reserved = (id: string) => cart.find((l) => l.id === id)?.qty ?? 0;

  return batches
    .filter(
      (b) =>
        b.med === med &&
        b.state === "open" &&
        daysTo(b.expiry) >= 0 &&
        b.left - reserved(b.id) > 0,
    )
    .sort((a, b) => (a.expiry < b.expiry ? -1 : 1))[0];
}
