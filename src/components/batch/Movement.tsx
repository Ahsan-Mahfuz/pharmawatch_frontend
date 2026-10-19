"use client";

import { tk2 } from "@/domain";
import { Card, CardHead } from "@/components/ui/Card";
import { useAppSelector } from "@/store/hooks";
import { selectSales } from "@/store/selectors";

export function Movement({ batchId }: { batchId: string }) {
  const sales = useAppSelector(selectSales).filter((s) => s.batchId === batchId);

  return (
    <Card>
      <CardHead title="Recent movement" sub="Sales recorded against this batch." />

      <div className="px-[22px] pb-[22px] max-sm:px-4">
        {sales.length === 0 ? (
          <p className="sub">Nothing has been sold from this batch yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-[13px]">
              <thead>
                <tr>
                  {["Date", "Invoice", "Sold by", "Qty", "Amount"].map((h, i) => (
                    <th
                      key={h}
                      scope="col"
                      className={`eyebrow border-b border-line py-2 ${i >= 3 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sales.map((s, i) => (
                  <tr key={`${s.inv}-${i}`}>
                    <td className="num border-b border-line py-2.5">{s.date}</td>
                    <td className="num border-b border-line py-2.5">{s.inv}</td>
                    <td className="border-b border-line py-2.5">{s.by}</td>
                    <td className="num border-b border-line py-2.5 text-right">{s.qty}</td>
                    <td className="num border-b border-line py-2.5 text-right">{tk2(s.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Card>
  );
}
