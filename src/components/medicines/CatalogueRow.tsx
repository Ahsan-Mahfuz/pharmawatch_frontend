"use client";

import { useState } from "react";
import type { WireMedicine } from "@/lib/api/wire";
import { Chip } from "@/components/ui/Chip";
import { MedicineForm } from "./MedicineForm";

export function CatalogueRow({ row, batches }: { row: WireMedicine; batches: number }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="list-none border-t border-line py-4">
        <MedicineForm
          id={row._id}
          initial={{
            name: row.name, generic: row.generic, strength: row.strength,
            form: row.form as "tablet", manufacturer: row.manufacturer,
            unit: row.unit as "strips",
          }}
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex list-none flex-wrap items-center gap-4 border-t border-line py-3.5">
      <span className="min-w-0 flex-[1_1_280px]">
        <span className="block truncate font-bold">
          {row.name} <span className="font-normal text-ink-3">{row.strength}</span>
        </span>
        <span className="block truncate text-[12.5px] text-ink-3">
          {row.generic} · {row.form} · counted in {row.unit}
          {row.manufacturer ? ` · ${row.manufacturer}` : ""}
        </span>
      </span>

      <Chip color={batches ? "var(--st-active)" : "var(--ink-3)"}>
        {batches ? `${batches} on the shelf` : "no stock"}
      </Chip>

      <button
        type="button"
        className="btn btn-quiet btn-sm"
        onClick={() => setEditing(true)}
        aria-label={`Edit ${row.name} ${row.strength}`}
      >
        Edit
      </button>
    </li>
  );
}
