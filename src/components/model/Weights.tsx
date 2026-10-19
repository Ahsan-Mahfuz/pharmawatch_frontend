"use client";

import { weightBars } from "@/domain";
import { Bar } from "@/components/ui/Bar";
import { Card, CardHead } from "@/components/ui/Card";
import { directionVar } from "@/lib/colors";
import type { WireModelInfo } from "@/lib/api/catalogue";

export function Weights({ info }: { info: WireModelInfo | null }) {
  const bars = info ? weightBars(info.weights) : [];

  return (
    <Card>
      <CardHead
        title="Learned weights"
        right={info ? <span className="eyebrow">version {info.version}</span> : null}
      />

      <div className="px-5.5 pb-4.5 max-sm:px-4">
        {bars.length === 0 ? (
          <p className="py-6 text-[13.5px] text-ink-2">Reading the model…</p>
        ) : (
          bars.map((w) => (
            <div key={w.name}
              className="grid grid-cols-[minmax(0,1fr)_90px_60px] items-center gap-3 border-t border-line py-2.5">
              <span className="text-[13.5px]">{w.name}</span>
              <Bar percent={w.width} color={directionVar(w.weight)} height={6} />
              <span className="num text-right text-[13px] font-semibold">{w.text}</span>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
