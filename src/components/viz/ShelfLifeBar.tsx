import { statusVar } from "@/lib/colors";
import type { Status } from "@/domain";

type Props = {
  elapsed: number;
  cutPct: number;
  status: Status;
  height?: number;
  label?: string;
};

export function ShelfLifeBar({ elapsed, cutPct, status, height = 8, label }: Props) {
  return (
    <span
      className="relative block overflow-hidden rounded-full bg-sunk"
      style={{ height }}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": "true" })}
    >
      <span
        className="absolute inset-y-0 left-0 block rounded-full"
        style={{ width: `${elapsed}%`, background: statusVar[status] }}
      />
      <span
        className="absolute inset-y-0 block bg-ink opacity-55"
        style={{ left: `${cutPct}%`, width: height >= 12 ? 3 : 2 }}
      />
    </span>
  );
}
