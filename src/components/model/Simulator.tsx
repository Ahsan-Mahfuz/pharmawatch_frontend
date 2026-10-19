"use client";

import { simPresets, simView } from "@/domain";
import { Chip } from "@/components/ui/Chip";
import { bandVar } from "@/lib/colors";
import { setSim } from "@/store/ui.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBatches, selectSim } from "@/store/selectors";
import { SimSliders } from "./SimSliders";

export function Simulator() {
  const sim = simView(useAppSelector(selectSim));
  const presets = simPresets(useAppSelector(selectBatches));
  const dispatch = useAppDispatch();
  const color = bandVar[sim.band];

  return (
    <section className="card flex flex-col gap-4.5 px-5.5 pt-5 pb-5.5 max-sm:px-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="h3">Try a batch</h2>
          <p className="sub">Load a real batch or set your own numbers.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button key={p.id} type="button" className="btn btn-sm"
              onClick={() => dispatch(setSim(p.input))}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-5 rounded-panel bg-paper-2 px-[18px] py-4">
        <p className="num m-0 font-display text-[76px] leading-[.9] font-[750] tracking-[-0.05em]"
          style={{ color }}>
          {sim.pText}
        </p>
        <div className="flex flex-[1_1_200px] flex-col gap-1.5">
          <Chip color={color} className="self-start">
            {sim.band} risk · {sim.word}
          </Chip>
          <p className="m-0 text-[13.5px] text-ink-2">{sim.line}</p>
        </div>
      </div>

      <SimSliders sim={sim} />
    </section>
  );
}
