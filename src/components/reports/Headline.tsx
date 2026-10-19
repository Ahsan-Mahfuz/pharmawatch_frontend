import { tk, type ReportTotals } from "@/domain";

export function Headline({ totals }: { totals: ReportTotals }) {
  return (
    <p className="m-0 mt-3.5 max-w-[34ch] font-display text-[clamp(22px,2.6vw,30px)] leading-[1.2] font-semibold tracking-[-0.02em] text-balance">
      This month <span className="text-st-active">{tk(totals.recovered)}</span> came back
      through returns, <span className="text-accent">{tk(totals.discountSales)}</span> sold
      at a discount and{" "}
      <span className="text-st-expired">{tk(totals.writtenOff)}</span> was written off.
    </p>
  );
}
