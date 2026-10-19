"use client";

import { shelfCalendar } from "@/domain";
import { Card, CardHead } from "@/components/ui/Card";
import { Seg } from "@/components/ui/Seg";
import { StatusLegend } from "@/components/ui/StatusLegend";
import { setHover, setRange } from "@/store/ui.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBatchMap, selectOpenBatches } from "@/store/selectors";
import { CalendarColumn } from "./CalendarColumn";

const RANGES = [
  { key: "12", label: "12 months" },
  { key: "6", label: "6 months" },
] as const;

export function ShelfCalendar() {
  const open = useAppSelector(selectOpenBatches);
  const byId = useAppSelector(selectBatchMap);
  const { range, hoverId } = useAppSelector((s) => s.ui);
  const dispatch = useAppDispatch();

  const { columns, beyond } = shelfCalendar(open, range);
  const hovered = hoverId ? byId.get(hoverId) : undefined;

  return (
    <Card>
      <CardHead
        title="Shelf calendar"
        sub="Every open batch, stacked in the month it expires. Select one to open it."
        right={
          <Seg
            label="Calendar range"
            options={RANGES}
            value={String(range) as "12" | "6"}
            onChange={(k) => dispatch(setRange(Number(k) as 12 | 6))}
          />
        }
      />

      <div className="px-[22px] pb-[22px] pt-1 max-sm:px-4">
        <div className="overflow-x-auto pb-1">
          <div
            className="grid gap-2"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, minmax(64px, 1fr))`,
              minWidth: columns.length * 72,
            }}
          >
            {columns.map((column) => (
              <CalendarColumn
                key={column.key}
                column={column}
                onHover={(id) => dispatch(setHover(id))}
              />
            ))}
          </div>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2.5 border-t border-dashed border-line pt-3.5">
          <p className="m-0 min-h-[21px] flex-[1_1_320px] text-[13.5px] text-ink-2">
            {hovered
              ? `${hovered.med} · ${hovered.id} · ${hovered.left} ${hovered.unit} · expires ${hovered.expiryText} · risk ${hovered.p.toFixed(2)}`
              : "Point at a capsule to preview the batch here."}
          </p>
          <StatusLegend />
        </div>

        {beyond > 0 ? (
          <p className="mt-2 text-[12.5px] text-ink-3">
            {beyond} more {beyond === 1 ? "batch expires" : "batches expire"} beyond this range.
          </p>
        ) : null}
      </div>
    </Card>
  );
}
