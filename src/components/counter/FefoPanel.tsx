"use client";

import { Chip } from "@/components/ui/Chip";
import { counterQueue, fefoNote } from "@/domain";
import { roleVar } from "@/lib/colors";
import { useAppSelector } from "@/store/hooks";
import { selectBatches, selectCart } from "@/store/selectors";

export function FefoPanel({ med }: { med: string }) {
  const all = useAppSelector(selectBatches);
  const cart = useAppSelector(selectCart);

  const reserved = (id: string) => cart.find((l) => l.id === id)?.qty ?? 0;
  const rows = counterQueue(all, reserved, med);

  return (
    <aside className="flex flex-col gap-2.5 rounded-2xl border border-line bg-paper-2 p-4">
      <p className="eyebrow">Oldest stock first · {med}</p>
      <p className="m-0 text-[13.5px] text-pretty">{fefoNote(all, med)}</p>

      {rows.map(({ batch, role, label, line }) => (
        <div
          key={batch.id}
          className="flex items-center justify-between gap-3 border-t border-line pt-2 text-[13px]"
        >
          <span className="min-w-0">
            <span className="num font-bold">{batch.id}</span>{" "}
            <span className="num text-ink-3">{line}</span>
          </span>
          <Chip color={roleVar[role]}>{label}</Chip>
        </div>
      ))}
    </aside>
  );
}
