import type { ApprovalView } from "@/domain";
import { Chip } from "@/components/ui/Chip";
import { approvalVar } from "@/lib/colors";

export function DecidedRow({ req }: { req: ApprovalView }) {
  return (
    <li className="flex list-none flex-wrap items-center gap-4 border-t border-line py-3.5">
      <Chip color={approvalVar(req.status)}>{req.statusText}</Chip>

      <span className="min-w-0 flex-[1_1_260px]">
        <span className="block truncate font-semibold">
          {req.type} · {req.med}{" "}
          <span className="num font-normal text-ink-3">{req.batchId}</span>
        </span>
        <span className="block text-[12.5px] text-ink-3">
          {req.id} · {req.qtyText} · {req.valueText} · asked by {req.by} · decided{" "}
          {req.decidedText}
        </span>
      </span>
    </li>
  );
}
