import { Capsule } from "@/components/viz/Capsule";
import type { CalendarColumn as Column } from "@/domain";

type Props = { column: Column; onHover: (id: string | null) => void };

export function CalendarColumn({ column, onHover }: Props) {
  return (
    <div
      className="flex min-h-[230px] flex-col gap-1 rounded-inner px-[7px] py-2.5"
      style={{
        background: column.past
          ? "color-mix(in srgb, var(--st-expired) 8%, var(--paper))"
          : "var(--paper-2)",
      }}
    >
      <div className="flex items-baseline justify-between gap-1">
        <span
          className="num text-[11.5px] font-bold"
          style={{
            color: column.past
              ? "var(--st-expired)"
              : column.current
                ? "var(--accent)"
                : "var(--ink)",
          }}
        >
          {column.label}
        </span>
        <span className="num text-[11px] text-ink-3">{column.items.length || ""}</span>
      </div>

      <p className="num m-0 min-h-[15px] text-[10px] text-ink-3">{column.sub}</p>

      <div className="mt-1.5 flex flex-1 flex-col-reverse gap-1.5">
        {column.items.map((item) => (
          <Capsule
            key={item.id}
            id={item.id}
            status={item.st}
            label={item.aria}
            onHover={onHover}
          >
            {item.short}
          </Capsule>
        ))}
      </div>
    </div>
  );
}
