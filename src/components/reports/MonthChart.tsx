import { beyondText, compactTk, monthBars, toPercent, type EnrichedBatch } from "@/domain";
import { Card, CardHead } from "@/components/ui/Card";
import { Column } from "@/components/ui/Bar";
import { barVar } from "@/lib/colors";

export function MonthChart({ open }: { open: readonly EnrichedBatch[] }) {
  const { bars, beyond } = monthBars(open);
  const pct = toPercent(bars.map((b) => b.value));
  const cols = { gridTemplateColumns: `repeat(${bars.length}, minmax(0, 1fr))` };

  return (
    <Card>
      <CardHead
        title="Value at risk by expiry month"
        sub="Cost of the units expected to expire unsold, grouped by when they expire."
      />

      <div className="px-[22px] pb-[22px] max-sm:px-4">
        <div className="grid h-[220px] items-end gap-2.5 border-b border-line-2" style={cols}>
          {bars.map((bar) => (
            <div key={bar.key} className="flex min-w-0 flex-col justify-end gap-1.5">
              <span className="num text-center text-[11px] text-ink-2">
                {bar.value > 0 ? compactTk(bar.value) : "·"}
              </span>
              <Column percent={pct(bar.value)} color={barVar[bar.tone]} maxHeight={180} />
            </div>
          ))}
        </div>

        <div className="grid gap-2.5 pt-2" style={cols}>
          {bars.map((bar) => (
            <span key={bar.key} className="num text-center text-[11px] text-ink-3">
              {bar.label}
            </span>
          ))}
        </div>

        <p className="mt-3.5 mb-0 text-[12.5px] text-ink-3">{beyondText(bars, beyond)}</p>
      </div>
    </Card>
  );
}
