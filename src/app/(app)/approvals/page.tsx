"use client";

import { Card, CardHead } from "@/components/ui/Card";
import { DecidedRow } from "@/components/approvals/DecidedRow";
import { PendingRow } from "@/components/approvals/PendingRow";
import { RoleBanner } from "@/components/approvals/RoleBanner";
import { useAppSelector } from "@/store/hooks";
import { selectApprovalQueue } from "@/store/selectors";

export default function ApprovalsPage() {
  const { pending, done } = useAppSelector(selectApprovalQueue);
  const count = `${pending.length} ${pending.length === 1 ? "request" : "requests"}`;

  return (
    <div className="screen flex flex-col gap-5">
      <div>
        <p className="eyebrow">Two person rule</p>
        <h1 className="h2 mt-1.5">Approvals</h1>
        <p className="sub">
          Returns and write-offs take stock off the books, so the owner signs off on each
          one and nobody approves their own request.
        </p>
      </div>

      <RoleBanner />

      <Card>
        <CardHead title="Waiting for a decision" right={<span className="eyebrow">{count}</span>} />
        <div className="px-[22px] pb-2.5 max-sm:px-4">
          {pending.length === 0 ? (
            <p className="border-t border-line py-7 text-[14px] text-ink-2">
              The queue is clear. New requests from the batch pages land here.
            </p>
          ) : (
            <ul aria-label="Requests waiting for a decision" className="m-0 flex list-none flex-col p-0">
              {pending.map((req) => (
                <PendingRow key={req.id} req={req} />
              ))}
            </ul>
          )}
        </div>
      </Card>

      <Card>
        <CardHead title="Decided" />
        <div className="px-[22px] pb-2.5 max-sm:px-4">
          <ul aria-label="Decided requests" className="m-0 flex list-none flex-col p-0">
            {done.map((req) => (
              <DecidedRow key={req.id} req={req} />
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}
