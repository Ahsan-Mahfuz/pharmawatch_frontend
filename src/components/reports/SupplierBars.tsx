import type { SupplierBar } from "@/domain";
import { Bar } from "@/components/ui/Bar";
import { Card, CardHead } from "@/components/ui/Card";

export function SupplierBars({ bars }: { bars: SupplierBar[] }) {
  return (
    <Card>
      <CardHead
        title="Value at risk by supplier"
        sub="Where returns and buying changes would save the most."
      />

      <div className="flex flex-col px-[22px] pb-[18px] max-sm:px-4">
        {bars.map((bar) => (
          <div
            key={bar.name}
            className="grid grid-cols-[minmax(110px,150px)_minmax(0,1fr)_64px] items-center gap-3 border-t border-line py-2.5"
          >
            <span className="truncate text-[13.5px]">{bar.name}</span>
            <Bar percent={bar.percent} color="var(--st-critical)" height={10} />
            <span className="num text-right text-[12.5px] font-semibold">{bar.valueText}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
