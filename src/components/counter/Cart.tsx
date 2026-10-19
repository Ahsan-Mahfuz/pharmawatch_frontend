"use client";

import { cartSummary, tk } from "@/domain";
import { clearCart } from "@/store/pharmacy.slice";
import { completeSale } from "@/store/pharmacy.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  selectBusy, selectCartLines, selectCartTotal, selectCartUnits, selectSaleLines,
} from "@/store/selectors";
import { CartRow } from "./CartRow";

export function Cart() {
  const lines = useAppSelector(selectCartLines);
  const total = useAppSelector(selectCartTotal);
  const units = useAppSelector(selectCartUnits);
  const saleLines = useAppSelector(selectSaleLines);
  const busy = useAppSelector(selectBusy);
  const dispatch = useAppDispatch();
  const empty = lines.length === 0;

  return (
    <section className="card flex flex-col gap-1.5 px-[22px] pt-5 pb-[22px] max-sm:px-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="h3">Cart</h2>
        <span className="eyebrow">{cartSummary(units, lines.length)}</span>
      </div>

      {empty ? (
        <div className="mt-2.5 border-t border-line py-10 text-center">
          <p className="h3">The cart is empty</p>
          <p className="sub">Add a medicine from the list to start an invoice.</p>
        </div>
      ) : (
        lines.map(({ line, batch, amount }) => (
          <CartRow key={line.id} batch={batch} qty={line.qty} amount={amount} />
        ))
      )}

      <div className="mt-1 flex items-baseline justify-between border-t-2 border-ink pt-4">
        <span className="font-semibold">Total</span>
        <span className="num font-display text-[34px] font-[750]">{tk(total)}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2.5">
        <button type="button" className="btn btn-primary flex-[1_1_200px]" disabled={empty || busy}
          onClick={() => void dispatch(completeSale(saleLines))}>
          {busy ? "Recording…" : "Complete sale"}
        </button>
        <button type="button" className="btn btn-quiet" disabled={empty}
          onClick={() => dispatch(clearCart())}>
          Clear cart
        </button>
      </div>

      <p className="mt-2 mb-0 text-[12.5px] text-ink-3">
        Prices include any discount that is live on a batch. Completing the sale takes the
        units off the shelf at once.
      </p>
    </section>
  );
}
