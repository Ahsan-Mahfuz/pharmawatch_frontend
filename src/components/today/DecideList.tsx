"use client";

import Link from "next/link";
import { Card, CardHead } from "@/components/ui/Card";
import { useAppSelector } from "@/store/hooks";
import { selectDecideToday } from "@/store/selectors";
import { DecideRow } from "./DecideRow";

export function DecideList() {
  const rows = useAppSelector(selectDecideToday);

  return (
    <Card>
      <CardHead
        title="Decide today"
        sub="Highest risk first. Batches already waiting on approval sit at the bottom."
        right={
          <Link href="/batches" className="btn btn-sm">
            All batches
          </Link>
        }
      />

      <div className="px-[22px] pb-2 max-sm:px-4">
        {rows.length === 0 ? (
          <div className="py-8 text-center">
            <p className="h3">Nothing needs a decision</p>
            <p className="sub">Every open batch is on pace to sell before it expires.</p>
          </div>
        ) : (
          <ul className="m-0 flex list-none flex-col p-0">
            {rows.map((batch) => (
              <DecideRow key={batch.id} batch={batch} />
            ))}
          </ul>
        )}
      </div>
    </Card>
  );
}
