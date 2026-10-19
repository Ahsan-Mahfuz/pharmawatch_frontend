"use client";

import { FailureModes } from "@/components/model/FailureModes";
import { Metrics } from "@/components/model/Metrics";
import { Simulator } from "@/components/model/Simulator";
import { Weights } from "@/components/model/Weights";
import { useModelInfo } from "@/lib/useModelInfo";

export default function RiskModelPage() {
  const info = useModelInfo();

  return (
    <div className="screen flex flex-col gap-5">
      <div>
        <p className="eyebrow">
          Logistic regression{info ? ` · version ${info.version}` : ""} · scored on read
        </p>
        <h1 className="h2 mt-1.5">Risk model</h1>
        <p className="sub">
          One number per batch: the chance it does not sell out before it expires. Move the
          sliders to see how it thinks.
        </p>
      </div>

      <div className="grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(460px,100%),1fr))]">
        <Simulator />

        <div className="flex min-w-0 flex-col gap-5">
          <Metrics info={info} />
          <Weights info={info} />
        </div>
      </div>

      <FailureModes info={info} />
    </div>
  );
}
