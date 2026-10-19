import { MONTHS, getToday } from "@/domain";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

export function headerStamp(iso: string = getToday()): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;

  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${weekday} ${String(d).padStart(2, "0")} ${MONTHS[m - 1]?.toUpperCase()} ${y}`;
}

const LONG_DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
] as const;

const LONG_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export function longDate(iso: string = getToday()): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;

  const weekday = LONG_DAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${weekday} ${d} ${LONG_MONTHS[m - 1]}`;
}

export function monthStamp(iso: string = getToday()): string {
  const [y, m] = iso.split("-").map(Number);
  if (!y || !m) return iso;
  return `${LONG_MONTHS[m - 1]} ${y}`;
}
