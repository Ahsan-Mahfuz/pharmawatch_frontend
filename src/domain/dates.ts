export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

const DAY_MS = 86_400_000;

function utc(iso: string): number {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return Number.NaN;
  return Date.UTC(y, m - 1, d);
}

const ymd = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

let today = ymd(new Date());

export function setToday(value: string): void {
  today = value;
}

export function getToday(): string {
  return today;
}

export function daysTo(iso: string): number {
  return Math.round((utc(iso) - utc(today)) / DAY_MS);
}

export function fd(iso: string): string {
  const [y, m, d] = String(iso).split("-");
  const month = MONTHS[Number(m) - 1];
  return month ? `${d} ${month} ${y}` : iso;
}

export function fds(iso: string): string {
  const [, m, d] = String(iso).split("-");
  const month = MONTHS[Number(m) - 1];
  return month ? `${d} ${month}` : iso;
}

export function monthKey(iso: string): string {
  const [y, m] = String(iso).split("-");
  const month = MONTHS[Number(m) - 1];
  return month ? `${month} ${String(y).slice(2)}` : iso;
}

export function clock(now: Date = new Date()): string {
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function dayOf(stamp: string): string {
  return ymd(new Date(stamp));
}

export function whenText(stamp: string): string {
  const day = dayOf(stamp);
  const now = getToday();
  if (day === now) return clock(new Date(stamp));

  const gap = daysTo(day);
  if (gap === -1) return "Yesterday";
  return fds(day);
}
