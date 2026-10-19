"use client";

import { metricBars, recallLine } from "@/domain";
import { Bar } from "@/components/ui/Bar";
import { Card, CardHead } from "@/components/ui/Card";
import type { WireModelInfo } from "@/lib/api/catalogue";

export function Metrics({ info }: { info: WireModelInfo | null }) {
  if (!info) {
    return (
      <Card>
        <CardHead title="How it performs" />
        <p className="px-[22px] pb-[22px] text-[13.5px] text-ink-2 max-sm:px-4">
          Reading the evaluation…
        </p>
      </Card>
    );
  }

  const { sampleSize, split, model, baseline, baselineRule } = info.evaluation;

  return (
    <Card>
      <CardHead
        title="How it performs"
        right={<span className="eyebrow">{sampleSize} past batches · {split}</span>}
      />

      <div className="px-[22px] pb-[22px] max-sm:px-4">
        <dl className="m-0 grid gap-px overflow-hidden rounded-[14px] border border-line bg-line [grid-template-columns:repeat(auto-fit,minmax(110px,1fr))]">
          {metricBars(model, baseline).map((m) => (
            <div key={m.key} className="bg-paper px-3.5 py-3">
              <dd className="num m-0 text-[24px] font-bold">{m.value.toFixed(2)}</dd>
              <dt className="eyebrow">{m.key}</dt>
              <Bar percent={m.value * 100} color="var(--accent)" height={6} className="mt-2" />
              <dd className="num m-0 mt-1.5 text-[11px] text-ink-3">
                rule of thumb {m.baseline.toFixed(2)}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-3.5 mb-0 text-[13.5px] text-ink-2 text-pretty">
          {recallLine(model.recall, baseline.recall, baselineRule)}
        </p>
      </div>
    </Card>
  );
}
