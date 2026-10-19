"use client";

import { SIM_RANGES, type SimView } from "@/domain";
import { setSim } from "@/store/ui.slice";
import { useAppDispatch } from "@/store/hooks";

export function SimSliders({ sim }: { sim: SimView }) {
  const dispatch = useAppDispatch();

  return (
    <>
      {SIM_RANGES.map((r) => (
        <div key={r.key} className="fld">
          <span className="flex justify-between">
            <label htmlFor={`sim-${r.key}`}>{r.label}</label>
            <span className="num text-ink" aria-hidden="true">
              {r.key === "rate" ? sim.rateText : sim[r.key]}
            </span>
          </span>
          <input
            id={`sim-${r.key}`}
            type="range"
            min={r.min}
            max={r.max}
            step={r.step}
            value={sim[r.key]}
            onChange={(e) => dispatch(setSim({ [r.key]: Number(e.target.value) }))}
          />
        </div>
      ))}
    </>
  );
}
