import { tk, type ReportTotals } from "@/domain";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function Totals({ totals }: { totals: ReportTotals }) {
  const tiles = [
    {
      label: "Recovered by returns",
      value: tk(totals.recovered),
      sub: plural(totals.returnsCount, "return approved", "returns approved"),
      color: "var(--st-active)",
    },
    {
      label: "Discount sales",
      value: tk(totals.discountSales),
      sub: `at a cost of ${tk(totals.discountGiven)} in discounts`,
    },
    {
      label: "Written off",
      value: tk(totals.writtenOff),
      sub: plural(totals.writeOffCount, "batch written off", "batches written off"),
      color: "var(--st-expired)",
    },
    {
      label: "Still at risk · 90 days",
      value: tk(totals.risk90),
      sub: "expected to expire unsold",
      color: "var(--st-critical)",
    },
  ];

  return (
    <dl className="m-0 grid border-t-2 border-ink [grid-template-columns:repeat(auto-fit,minmax(min(220px,100%),1fr))]">
      {tiles.map((t) => (
        <div key={t.label} className="border-b border-line pt-3.5 pr-4 pb-4">
          <dt className="eyebrow">{t.label}</dt>
          <dd className="num m-0 mt-1.5 text-[28px] font-bold" style={{ color: t.color }}>
            {t.value}
          </dd>
          <dd className="m-0 text-[12.5px] text-ink-2">{t.sub}</dd>
        </div>
      ))}
    </dl>
  );
}
