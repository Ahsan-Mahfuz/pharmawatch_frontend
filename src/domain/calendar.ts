import { MONTHS, getToday } from "./dates";
import type { EnrichedBatch } from "./enrich";
import type { Status } from "./types";

export type CalendarItem = {
  id: string;
  short: string;
  st: Status;
  aria: string;
};

export type CalendarColumn = {
  key: string;
  label: string;
  sub: string;
  past: boolean;
  current: boolean;
  items: CalendarItem[];
};

export type ShelfCalendar = { columns: CalendarColumn[]; beyond: number };

function monthIndex(iso: string): number {
  const [y, m] = iso.split("-").map(Number);
  return (y ?? 0) * 12 + ((m ?? 1) - 1);
}

export function shelfCalendar(
  open: readonly EnrichedBatch[],
  range: number,
): ShelfCalendar {
  const base = monthIndex(getToday());

  const columns: CalendarColumn[] = [
    { key: "past", label: "Past", sub: "expired", past: true, current: false, items: [] },
  ];

  for (let i = 0; i < range; i++) {
    const m = (base + i) % 12;
    const y = Math.floor((base + i) / 12);
    columns.push({
      key: `${y}-${m}`,
      label: MONTHS[m]!,
      sub: i === 0 || m === 0 ? String(y) : "",
      past: false,
      current: i === 0,
      items: [],
    });
  }

  let beyond = 0;

  [...open]
    .sort((a, b) => (a.expiry < b.expiry ? -1 : 1))
    .forEach((b) => {
      const item: CalendarItem = {
        id: b.id,
        short: b.id.split("-")[0] ?? b.id,
        st: b.st,
        aria: `${b.med}, batch ${b.id}, ${b.statusText}, expires ${b.expiryText}`,
      };

      if (b.d < 0) {
        columns[0]!.items.push(item);
        return;
      }
      const idx = monthIndex(b.expiry) - base;
      if (idx >= 0 && idx < range) columns[idx + 1]!.items.push(item);
      else beyond++;
    });

  return { columns, beyond };
}
