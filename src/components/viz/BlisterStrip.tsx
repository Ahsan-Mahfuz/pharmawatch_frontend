import { statusVar } from "@/lib/colors";
import type { Status } from "@/domain";

type Props = {
  filled: number;
  status: Status;
  size?: "row" | "detail";
  label?: string;
};

const CAPSULES = 10;

export function BlisterStrip({ filled, status, size = "row", label }: Props) {
  const color = statusVar[status];
  const detail = size === "detail";

  return (
    <span
      className={detail ? "flex gap-[5px]" : "flex gap-[3px]"}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": "true" })}
    >
      {Array.from({ length: CAPSULES }, (_, i) => (
        <span
          key={i}
          className="block"
          style={{
            ...(detail
              ? { flex: 1, height: 30, borderRadius: 10, borderWidth: 2 }
              : { width: 9, height: 15, borderRadius: 5, borderWidth: 1.5 }),
            borderStyle: "solid",
            background: i < filled ? color : "transparent",
            borderColor: i < filled ? color : "var(--line-2)",
          }}
        />
      ))}
    </span>
  );
}
