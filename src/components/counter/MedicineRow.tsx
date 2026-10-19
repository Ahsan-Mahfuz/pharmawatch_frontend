"use client";

import type { CounterRow } from "@/domain";

type Props = {
  row: CounterRow;
  active: boolean;
  onAdd: (med: string) => void;
};

export function MedicineRow({ row, active, onAdd }: Props) {
  return (
    <li
      className="medrow"
      style={active ? { borderColor: "var(--accent)" } : undefined}
    >
      <span className="min-w-0 flex-1">
        <span className="block truncate font-bold">{row.med}</span>
        <span className="block truncate text-[12.5px] text-ink-3">
          {row.gen} ·{" "}
          <span className="num">
            {row.next
              ? `next from ${row.next.id}, exp ${row.next.expiryShort}`
              : "no sellable batch"}
          </span>
        </span>
      </span>

      <span className="text-right">
        <span className="num block font-bold">{row.next ? row.next.priceText : "·"}</span>
        <span className="num block text-[11.5px] text-ink-3">
          {row.available} {row.unit} sellable
        </span>
      </span>

      <button
        type="button"
        className="btn btn-primary btn-sm"
        disabled={!row.next}
        aria-label={`Add one ${row.med}`}
        onClick={() => onAdd(row.med)}
      >
        Add
      </button>
    </li>
  );
}
