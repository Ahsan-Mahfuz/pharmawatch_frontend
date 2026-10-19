import { tk, type Ledger as LedgerData } from "@/domain";

type CellProps = { label: string; value: string; sub: string; color?: string; left?: boolean };

function Cell({ label, value, sub, color, left }: CellProps) {
  return (
    <div
      className={`border-b border-line pb-4 pt-3.5 ${
        left ? "border-l border-l-line pl-3.5" : "pr-3.5"
      }`}
    >
      <p className="eyebrow">{label}</p>
      <p className="num mt-1.5 text-[28px] font-bold" style={color ? { color } : undefined}>
        {value}
      </p>
      <p className="text-[12.5px] text-ink-2">{sub}</p>
    </div>
  );
}

export function Ledger({ data }: { data: LedgerData }) {
  return (
    <div className="grid grid-cols-2 border-t-2 border-ink">
      <Cell
        label="Stock on shelf"
        value={tk(data.stock)}
        sub={`at cost · ${data.openCount} open batches`}
      />
      <Cell
        left
        label="Expiring in 30 days"
        value={String(data.expiring30)}
        sub={`batches · ${data.expired} already expired`}
        color="var(--st-critical)"
      />
      <Cell label="Awaiting approval" value={String(data.pending)} sub={data.pendingSub} />
      <Cell
        left
        label="Sales today"
        value={tk(data.salesToday)}
        sub={data.salesSub}
        color="var(--st-active)"
      />
    </div>
  );
}
