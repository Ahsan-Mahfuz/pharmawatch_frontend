"use client";

import { tk2, type EnrichedBatch } from "@/domain";
import { Seg } from "@/components/ui/Seg";
import { applyDiscount } from "@/store/pharmacy.thunks";
import { setPct } from "@/store/ui.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBusy } from "@/store/selectors";

const SIZES = [10, 15, 20, 25, 30];
const OPTIONS = SIZES.map((n) => ({ key: String(n), label: `${n}%` }));

export function DiscountPicker({ batch }: { batch: EnrichedBatch }) {
  const chosen = useAppSelector((s) => s.ui.pct);
  const busy = useAppSelector(selectBusy);
  const dispatch = useAppDispatch();

  const pct = chosen ?? batch.rec.pct ?? batch.discount ?? 10;
  const preview = batch.price * (1 - pct / 100);
  const disabled = batch.closed || batch.d < 0 || batch.pending || busy;

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-[13.5px] text-ink-2 text-pretty">
        {batch.discount
          ? `Live now: ${batch.discount}% off, selling at ${batch.priceText} instead of ${tk2(batch.price)}. Pick a new size to change it.`
          : "Choose a discount size, then apply it to the counter price."}
      </p>

      <Seg
        label="Discount size"
        options={OPTIONS}
        value={String(pct)}
        onChange={(k) => dispatch(setPct(Number(k)))}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn btn-primary"
          disabled={disabled}
          onClick={() => void dispatch(applyDiscount({ ref: batch.ref, id: batch.id, pct }))}
        >
          Apply {pct}% off
        </button>
        <p className="num m-0 text-[13px] text-ink-2">
          {tk2(batch.price)} → <strong>{tk2(preview)}</strong> per {batch.unit.replace(/s$/, "")}
        </p>
      </div>
    </div>
  );
}
