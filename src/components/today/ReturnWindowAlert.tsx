import Link from "next/link";
import { tk, type ReturnWindow } from "@/domain";
import { Chip } from "@/components/ui/Chip";

export function ReturnWindowAlert({ windows }: { windows: ReturnWindow[] }) {
  if (!windows.length) return null;

  const value = windows.reduce((a, w) => a + w.value, 0);
  const first = windows[0]!;
  const count = `${windows.length} ${windows.length === 1 ? "batch" : "batches"}`;

  return (
    <div className="flex flex-wrap items-center gap-3.5 rounded-panel border border-line bg-paper px-[18px] py-3.5">
      <Chip color="var(--st-near)">Return windows</Chip>

      <p className="m-0 flex-[1_1_300px] text-[14px] text-pretty">
        {count} can still go back to suppliers, worth {tk(value)} at cost. The first window
        closes on {first.batch.cutoffText}.
      </p>

      <Link href="/suppliers" className="btn btn-sm">
        See suppliers
      </Link>
    </div>
  );
}
