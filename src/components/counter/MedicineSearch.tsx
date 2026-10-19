"use client";

import { useState } from "react";
import { counterRows } from "@/domain";
import { addMedicine } from "@/store/pharmacy.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBatches, selectCart } from "@/store/selectors";
import { MedicineRow } from "./MedicineRow";

export function MedicineSearch({
  activeMed,
  onPick,
}: {
  activeMed: string;
  onPick: (med: string) => void;
}) {
  const [query, setQuery] = useState("");
  const all = useAppSelector(selectBatches);
  const cart = useAppSelector(selectCart);
  const dispatch = useAppDispatch();

  const reserved = (id: string) => cart.find((l) => l.id === id)?.qty ?? 0;
  const rows = counterRows(all, reserved, query);

  return (
    <>
      <div className="fld">
        <label htmlFor="sale-q">Find a medicine</label>
        <input
          id="sale-q"
          type="search"
          className="inp"
          placeholder="Name or generic"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {rows.length === 0 ? (
        <p className="py-6 text-[13.5px] text-ink-2">
          {all.length === 0
            ? "Nothing is on the shelf yet. Receive a batch on the register and it can be sold here."
            : "No medicine matches that search. Try the generic name."}
        </p>
      ) : (
        <ul aria-label="Medicines" className="m-0 flex max-h-[440px] list-none flex-col gap-2 overflow-y-auto p-0 pr-0.5">
          {rows.map((row) => (
            <MedicineRow
              key={row.med}
              row={row}
              active={row.med === activeMed}
              onAdd={(med) => {
                dispatch(addMedicine(med));
                onPick(med);
              }}
            />
          ))}
        </ul>
      )}
    </>
  );
}
