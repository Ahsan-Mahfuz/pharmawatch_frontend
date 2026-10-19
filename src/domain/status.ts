import type { Batch, Status } from "./types";

export function statusOf(b: Pick<Batch, "state" | "left">, d: number): Status {
  if (b.state !== "open" || b.left <= 0) return "closed";
  if (d < 0) return "expired";
  if (d <= 30) return "critical";
  if (d <= 90) return "near";
  return "active";
}

export function isClosed(b: Pick<Batch, "state" | "left">): boolean {
  return b.state !== "open" || b.left <= 0;
}

export function closedLabel(state: Batch["state"]): string {
  if (state === "returned") return "Returned";
  if (state === "written-off") return "Written off";
  return "Sold out";
}

const OPEN_LABELS: Record<Exclude<Status, "closed">, string> = {
  expired: "Expired",
  critical: "Critical",
  near: "Near expiry",
  active: "Active",
};

export function statusLabel(st: Status, state: Batch["state"]): string {
  return st === "closed" ? closedLabel(state) : OPEN_LABELS[st];
}

export function daysLabel(d: number, closed: boolean, state: Batch["state"]): string {
  if (closed) return closedLabel(state);
  if (d < 0) return `${-d}d ago`;
  if (d === 0) return "today";
  return `${d}d left`;
}
