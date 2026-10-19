"use client";

import { closingWindows, tk } from "@/domain";
import { Card, CardHead } from "@/components/ui/Card";
import { useAppSelector } from "@/store/hooks";
import { selectOpenBatches } from "@/store/selectors";
import { ReturnWindowRow } from "./ReturnWindowRow";

export function ReturnWindows() {
  const windows = closingWindows(useAppSelector(selectOpenBatches));
  const value = windows.reduce((a, w) => a + w.value, 0);
  const summary = `${windows.length} ${windows.length === 1 ? "batch" : "batches"} · ${tk(value)}`;

  return (
    <Card>
      <CardHead
        title="Return windows closing"
        sub="Open batches a supplier still takes back within 45 days, soonest first."
        right={<span className="eyebrow">{summary}</span>}
      />

      <div className="px-[22px] pb-2.5 max-sm:px-4">
        {windows.length === 0 ? (
          <p className="border-t border-line py-6 text-[14px] text-ink-2">
            No return window closes in the next 45 days.
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {windows.map((w) => (
              <ReturnWindowRow key={w.batch.id} window={w} />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
