import { tk, type Ledger } from "@/domain";
import { longDate } from "@/lib/stamp";

export function Headline({ ledger, firstName }: { ledger: Ledger; firstName: string }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="eyebrow">
        {longDate()} · Good morning, {firstName}
      </p>

      <h1 className="m-0 max-w-[15ch] font-display text-[clamp(34px,4.6vw,60px)] font-bold leading-none tracking-[-0.035em] text-balance">
        <span className="text-st-critical">{tk(ledger.risk90)}</span> of stock may expire unsold
        in the next 90 days.
      </h1>

      <p className="m-0 max-w-[52ch] text-[16px] text-ink-2 text-pretty">
        {ledger.decideCount} batches need a decision. Each one below carries the move that
        recovers the most money, and you can act on it right here.
      </p>
    </div>
  );
}
