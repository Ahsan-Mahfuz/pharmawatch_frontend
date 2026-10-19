"use client";

import { tk2 } from "@/domain";
import type { EnrichedBatch } from "@/domain";
import { decLine, incLine, removeLine } from "@/store/pharmacy.slice";
import { useAppDispatch } from "@/store/hooks";

const MINUS = "M5 12h14";
const PLUS = "M12 5v14M5 12h14";
const CROSS = "M6 6l12 12M18 6L6 18";

function Glyph({ d, width = 2.2 }: { d: string; width?: number }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={width} strokeLinecap="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function CartRow({
  batch, qty, amount,
}: {
  batch: EnrichedBatch;
  qty: number;
  amount: number;
}) {
  const dispatch = useAppDispatch();

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_86px_38px] items-center gap-3 border-t border-line py-3">
      <div className="min-w-0">
        <p className="m-0 truncate font-bold">{batch.med}</p>
        <p className="num m-0 truncate text-[12px] text-ink-3">
          {batch.id} · {batch.priceText} each{" "}
          {batch.discount > 0 ? (
            <span className="text-st-critical">{batch.discount}% off</span>
          ) : null}
        </p>
      </div>

      <div className="flex items-center gap-1.5">
        <button type="button" className="qty" aria-label={`Take one ${batch.med} off`}
          onClick={() => dispatch(decLine(batch.id))}>
          <Glyph d={MINUS} />
        </button>
        <span className="num min-w-7 text-center font-bold">{qty}</span>
        <button type="button" className="qty" aria-label={`Add one more ${batch.med}`}
          onClick={() => dispatch(incLine(batch.id))}>
          <Glyph d={PLUS} />
        </button>
      </div>

      <span className="num text-right font-semibold">{tk2(amount)}</span>

      <button type="button" className="qty border-transparent"
        aria-label={`Remove ${batch.med} from the cart`}
        onClick={() => dispatch(removeLine(batch.id))}>
        <Glyph d={CROSS} width={2} />
      </button>
    </div>
  );
}
