import { tk, type EnrichedBatch } from "@/domain";
import { Card, CardHead } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { bandVar } from "@/lib/colors";
import { FactorBars } from "./FactorBars";

function sentence(b: EnrichedBatch): string {
  if (b.closed) return "This batch is closed, so it no longer carries risk.";
  if (b.d < 0)
    return "Already past expiry. Every unit left is lost unless it is written off and claimed.";
  return `Chance this batch does not sell out before ${b.expiryText}. About ${b.unsold} ${b.unit} (${tk(b.atRisk)}) would be left on the shelf.`;
}

export function RiskPanel({ batch }: { batch: EnrichedBatch }) {
  return (
    <Card>
      <CardHead
        title="Dead stock risk"
        right={<span className="eyebrow">scored nightly · model v7</span>}
      />

      <div className="grid items-start gap-6 px-[22px] pb-[22px] max-sm:px-4 [grid-template-columns:repeat(auto-fit,minmax(min(240px,100%),1fr))]">
        <div>
          <p
            className="num m-0 text-[64px] font-bold leading-none tracking-[-0.05em]"
            style={{ color: bandVar[batch.band] }}
          >
            {batch.closed ? "0.00" : batch.p.toFixed(2)}
          </p>
          <p className="mt-3">
            <Chip color={bandVar[batch.band]}>{batch.band} risk</Chip>
          </p>
          <p className="sub max-w-[36ch]">{sentence(batch)}</p>
        </div>

        <div>
          <p className="eyebrow mb-3">What drove the score</p>
          <FactorBars batch={batch} />
        </div>
      </div>
    </Card>
  );
}
