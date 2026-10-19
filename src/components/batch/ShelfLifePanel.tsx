import type { EnrichedBatch } from "@/domain";
import { Card, CardHead } from "@/components/ui/Card";
import { BlisterStrip } from "@/components/viz/BlisterStrip";
import { ShelfLifeBar } from "@/components/viz/ShelfLifeBar";

function Stamp({ label, value, align }: { label: string; value: string; align?: string }) {
  return (
    <div className={align}>
      <p className="eyebrow text-[9.5px]">{label}</p>
      <p className="num m-0 font-semibold">{value}</p>
    </div>
  );
}

export function ShelfLifePanel({ batch }: { batch: EnrichedBatch }) {
  return (
    <Card>
      <CardHead title="Shelf life" />

      <div className="flex flex-col gap-3.5 px-[22px] pb-[22px] max-sm:px-4">
        <ShelfLifeBar
          elapsed={batch.elapsed}
          cutPct={batch.cutPct}
          status={batch.st}
          height={14}
          label={`Received ${batch.receivedText}, returns close ${batch.cutoffText}, expires ${batch.expiryText}`}
        />

        <div className="grid grid-cols-3 gap-2.5 text-[12px]">
          <Stamp label="Received" value={batch.receivedText} />
          <Stamp label="Returns close" value={batch.cutoffText} align="text-center" />
          <Stamp label="Expires" value={batch.expiryText} align="text-right" />
        </div>

        <div className="mt-1.5">
          <BlisterStrip
            filled={batch.filled}
            status={batch.st}
            size="detail"
            label={batch.stockAria}
          />
        </div>

        <p className="num m-0 text-[12.5px] text-ink-2">{batch.stockAria}</p>
      </div>
    </Card>
  );
}
