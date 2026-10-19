"use client";

import { useMemo, useState } from "react";
import { Card, CardHead } from "@/components/ui/Card";
import { useAppSelector } from "@/store/hooks";
import { selectBatches, selectMedicines } from "@/store/selectors";
import { CatalogueRow } from "./CatalogueRow";

export function CatalogueList() {
  const [query, setQuery] = useState("");
  const medicines = useAppSelector(selectMedicines);
  const batches = useAppSelector(selectBatches);

  const openCount = useMemo(() => {
    const counts = new Map<string, number>();
    batches
      .filter((b) => !b.closed)
      .forEach((b) => counts.set(b.medId, (counts.get(b.medId) ?? 0) + 1));
    return counts;
  }, [batches]);

  const needle = query.trim().toLowerCase();
  const rows = medicines.filter(
    (m) => !needle || `${m.name} ${m.generic} ${m.manufacturer}`.toLowerCase().includes(needle),
  );

  return (
    <Card>
      <CardHead title={`${rows.length} of ${medicines.length} listed`} />

      <div className="px-[22px] pb-[22px] max-sm:px-4">
        <div className="fld mb-1">
          <label htmlFor="med-q">Search</label>
          <input
            id="med-q" type="search" className="inp" value={query}
            placeholder="Brand, generic or manufacturer"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {rows.length === 0 ? (
          <p className="py-8 text-center text-[13.5px] text-ink-2">
            {medicines.length === 0
              ? "The catalogue is empty. Add the first medicine to start receiving stock."
              : "No medicine matches that search."}
          </p>
        ) : (
          <ul aria-label="Medicines in the catalogue" className="m-0 flex list-none flex-col p-0">
            {rows.map((row) => (
              <CatalogueRow key={row._id} row={row} batches={openCount.get(row._id) ?? 0} />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
