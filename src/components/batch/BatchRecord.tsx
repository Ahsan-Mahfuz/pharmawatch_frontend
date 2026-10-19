import { tk, tk2, type EnrichedBatch } from "@/domain";
import { Card, CardHead } from "@/components/ui/Card";

function rows(b: EnrichedBatch): [string, string][] {
  return [
    ["Batch number", b.id],
    ["Supplier", b.sup],
    ["Quantity received", `${b.qtyIn} ${b.unit}`],
    ["Still on shelf", `${b.left} ${b.unit}`],
    ["Cost per unit", tk2(b.cost)],
    ["Counter price", b.priceText + (b.discount ? ` (${b.discount}% off)` : "")],
    ["Sell rate, 30 days", `${b.r30.toFixed(1)} / day`],
    ["Sell rate, 7 days", `${b.r7.toFixed(1)} / day`],
    [
      "Projected sales to expiry",
      b.closed ? "·" : `${Math.round(Math.min(b.left, b.projected))} ${b.unit}`,
    ],
    [
      "Expected to expire unsold",
      b.closed ? "·" : `${b.unsold} ${b.unit} · ${tk(b.atRisk)}`,
    ],
  ];
}

export function BatchRecord({ batch }: { batch: EnrichedBatch }) {
  return (
    <Card>
      <CardHead title="Batch record" />
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 px-[22px] pb-[22px] text-[13px] max-sm:px-4">
        {rows(batch).map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-ink-3">{k}</dt>
            <dd className="num m-0 text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
