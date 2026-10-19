import { riskFactors, type EnrichedBatch } from "@/domain";
import { Bar } from "@/components/ui/Bar";
import { directionVar } from "@/lib/colors";

export function FactorBars({ batch }: { batch: EnrichedBatch }) {
  const factors = riskFactors(batch);

  return (
    <ul className="m-0 flex list-none flex-col gap-3 p-0">
      {factors.map((f) => (
        <li key={f.name} className="grid grid-cols-[minmax(96px,1fr)_2fr_auto] items-center gap-3">
          <span>
            <span className="block text-[13px] font-semibold">{f.name}</span>
            <span className="block text-[11.5px] text-ink-3">{f.hint}</span>
          </span>

          <Bar percent={f.width} color={directionVar(f.effect)} height={6} />

          <span className="text-right">
            <span className="num block text-[13px] font-semibold">{f.value}</span>
            <span className="num block text-[11px] text-ink-3">
              {f.effectText} · {f.direction === "none" ? "no effect" : `${f.direction} risk`}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
