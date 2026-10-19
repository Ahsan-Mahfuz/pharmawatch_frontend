import { statusVar } from "@/lib/colors";
import type { Status } from "@/domain";

const ENTRIES: { status: Status; label: string }[] = [
  { status: "expired", label: "Expired" },
  { status: "critical", label: "Critical" },
  { status: "near", label: "Near expiry" },
  { status: "active", label: "Active" },
];

export function StatusLegend() {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-3.5 p-0 text-[12px] text-ink-2">
      {ENTRIES.map((e) => (
        <li key={e.status} className="inline-flex items-center gap-1.5">
          <i
            aria-hidden="true"
            className="block size-2.5 rounded-[3px]"
            style={{ background: statusVar[e.status] }}
          />
          {e.label}
        </li>
      ))}
    </ul>
  );
}
