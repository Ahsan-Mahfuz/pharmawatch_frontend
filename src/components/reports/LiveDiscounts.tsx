import Link from "next/link";
import type { LiveDiscount } from "@/domain";
import { Card, CardHead } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { bandVar } from "@/lib/colors";

export function LiveDiscounts({ list }: { list: LiveDiscount[] }) {
  return (
    <Card>
      <CardHead
        title="Live discounts"
        sub="Batches selling below full price right now, with their updated risk."
      />

      <div className="px-[22px] pb-2.5 max-sm:px-4">
        {list.length === 0 ? (
          <p className="border-t border-line py-5 text-[14px] text-ink-2">
            No discounts are live. Apply one from a batch page or from Decide today, and it
            shows up here.
          </p>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {list.map(({ batch, pctText, priceText, leftText }) => (
              <li key={batch.id}
                className="flex flex-wrap items-center gap-4 border-t border-line py-3.5">
                <Chip color="var(--st-critical)">{pctText}</Chip>

                <span className="min-w-0 flex-[1_1_260px]">
                  <span className="block truncate font-bold">
                    {batch.med} <span className="num font-normal text-ink-3">{batch.id}</span>
                  </span>
                  <span className="num block text-[12.5px] text-ink-3">
                    {priceText} · {leftText} left
                  </span>
                </span>

                <span className="num font-bold" style={{ color: bandVar[batch.band] }}>
                  risk {batch.p.toFixed(2)}
                </span>

                <Link href={`/batches/${batch.id}`} className="btn btn-quiet btn-sm"
                  aria-label={`Open ${batch.med} ${batch.id}`}>
                  Open
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
