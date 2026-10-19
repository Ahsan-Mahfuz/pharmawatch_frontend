"use client";

import { useRouter } from "next/navigation";
import { compactTk, tk, type SupplierCard as Data } from "@/domain";
import { Capsule } from "@/components/viz/Capsule";
import { bandVar } from "@/lib/colors";
import { bandOf } from "@/domain";
import { filterBySupplier } from "@/store/ui.slice";
import { useAppDispatch } from "@/store/hooks";

export function SupplierCard({ data }: { data: Data }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const openBatches = () => {
    dispatch(filterBySupplier(data.name));
    router.push("/batches");
  };

  return (
    <article className="card flex flex-col gap-3.5 px-[22px] py-5 max-sm:px-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="h3">{data.name}</h3>
          <p className="sub">{data.countText}</p>
        </div>
        <span
          className="num text-[12px] font-bold whitespace-nowrap"
          style={{ color: bandVar[bandOf(data.avgRisk, false)] }}
        >
          {data.avgText}
        </span>
      </div>

      <div className="flex min-h-8 flex-wrap gap-1.5">
        {data.openBatches.map((b) => (
          <Capsule key={b.id} id={b.id} status={b.st}
            label={`${b.med} ${b.id}, ${b.daysText}`}>
            <span className="px-1">{b.id.split("-")[0]}</span>
          </Capsule>
        ))}
      </div>

      <dl className="m-0 grid grid-cols-3 gap-2.5 border-t border-line pt-3">
        <div>
          <dt className="eyebrow">Stock</dt>
          <dd className="num m-0 font-bold">{compactTk(data.stockValue)}</dd>
        </div>
        <div>
          <dt className="eyebrow">At risk</dt>
          <dd className="num m-0 font-bold">{data.atRisk > 0 ? compactTk(data.atRisk) : tk(0)}</dd>
        </div>
        <div>
          <dt className="eyebrow">Next window</dt>
          <dd className="num m-0 font-bold">{data.nextCutoffText}</dd>
        </div>
      </dl>

      <button type="button" className="btn btn-sm self-start" onClick={openBatches}>
        View batches
      </button>
    </article>
  );
}
