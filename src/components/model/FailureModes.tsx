"use client";

import { Card, CardHead } from "@/components/ui/Card";
import type { WireModelInfo } from "@/lib/api/catalogue";

export function FailureModes({ info }: { info: WireModelInfo | null }) {
  const limits = info?.limitations ?? [];

  return (
    <Card>
      <CardHead
        title="Where it can be wrong"
        sub="Stated by the model itself, so the screen and the API cannot drift apart."
      />

      <div className="grid gap-3.5 px-5.5 pb-5.5 max-sm:px-4 grid-cols-[repeat(auto-fit,minmax(min(280px,100%),1fr))]">
        {limits.length === 0 ? (
          <p className="m-0 text-[13.5px] text-ink-2">Reading the limitations…</p>
        ) : (
          limits.map((text) => (
            <p key={text} className="m-0 rounded-panel bg-paper-2 p-4 text-[13.5px] text-ink-2">
              {text}
            </p>
          ))
        )}
      </div>
    </Card>
  );
}
