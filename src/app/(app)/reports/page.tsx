"use client";

import { liveDiscounts, reportTotals, supplierBars, supplierCards } from "@/domain";
import { Headline } from "@/components/reports/Headline";
import { LiveDiscounts } from "@/components/reports/LiveDiscounts";
import { MonthChart } from "@/components/reports/MonthChart";
import { SupplierBars } from "@/components/reports/SupplierBars";
import { Totals } from "@/components/reports/Totals";
import { monthStamp } from "@/lib/stamp";
import { useAppSelector } from "@/store/hooks";
import {
  selectApprovals, selectBatches, selectOpenBatches, selectSales,
} from "@/store/selectors";

export default function ReportsPage() {
  const all = useAppSelector(selectBatches);
  const open = useAppSelector(selectOpenBatches);
  const totals = reportTotals(
    useAppSelector(selectApprovals),
    useAppSelector(selectSales),
    open,
  );

  return (
    <div className="screen flex flex-col gap-6">
      <div>
        <p className="eyebrow">{monthStamp()} · month to date</p>
        <h1 className="h2 mt-1.5">Reports</h1>
        <Headline totals={totals} />
      </div>

      <Totals totals={totals} />

      <div className="grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(460px,100%),1fr))]">
        <MonthChart open={open} />
        <SupplierBars bars={supplierBars(supplierCards(all, open))} />
      </div>

      <LiveDiscounts list={liveDiscounts(open)} />
    </div>
  );
}
