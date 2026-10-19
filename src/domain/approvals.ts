import { tk } from "./money";
import type { Approval, Role } from "./types";

export type ApprovalView = Approval & {
  can: boolean;
  why: string;
  qtyText: string;
  valueText: string;
  statusText: string;
  decidedText: string;
};

const STATUS_TEXT: Record<Approval["status"], string> = {
  pending: "Waiting",
  approved: "Approved",
  rejected: "Rejected",
};

export function canDecide(req: Approval, role: Role, viewer: string): boolean {
  return role === "owner" && req.by !== viewer && req.status === "pending";
}

function reasonWhyNot(req: Approval, role: Role, viewer: string): string {
  if (req.status !== "pending") return "";
  if (role !== "owner") return "Only the owner can decide this.";
  if (req.by === viewer) return "You raised this request, so someone else has to approve it.";
  return "";
}

export function approvalView(req: Approval, role: Role, viewer: string): ApprovalView {
  return {
    ...req,
    can: canDecide(req, role, viewer),
    why: reasonWhyNot(req, role, viewer),
    qtyText: `${req.qty} ${req.unit}`,
    valueText: tk(req.value),
    statusText: STATUS_TEXT[req.status],
    decidedText: req.decidedBy ? `by ${req.decidedBy}` : "",
  };
}

export function approvalQueue(
  approvals: readonly Approval[],
  role: Role,
  viewer: string,
): { pending: ApprovalView[]; done: ApprovalView[] } {
  const all = approvals.map((a) => approvalView(a, role, viewer));
  return {
    pending: all.filter((a) => a.status === "pending"),
    done: all.filter((a) => a.status !== "pending"),
  };
}

export function roleBanner(role: Role, name: string): string {
  return role === "owner"
    ? `Signed in as ${name}, owner. You can approve or reject requests raised by your staff, but never your own.`
    : `Signed in as ${name}, pharmacist. Your requests go to the owner, who signs them off.`;
}
