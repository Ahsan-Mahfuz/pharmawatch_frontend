import type {
  ActivityTone, ApprovalStatus, ApprovalType, Band, CounterRole, RecKind, Status,
} from "@/domain";
import type { BarTone } from "@/domain";
import type { Urgency } from "@/domain";

export const statusVar: Record<Status, string> = {
  active: "var(--st-active)",
  near: "var(--st-near)",
  critical: "var(--st-critical)",
  expired: "var(--st-expired)",
  closed: "var(--st-closed)",
};

export const toneVar: Record<ActivityTone, string> = {
  muted: "var(--ink-3)",
  active: "var(--st-active)",
  near: "var(--st-near)",
  critical: "var(--st-critical)",
  expired: "var(--st-expired)",
};

export const bandVar: Record<Band, string> = {
  High: "var(--st-expired)",
  Medium: "var(--st-near)",
  Low: "var(--st-active)",
  No: "var(--st-closed)",
};

export const recVar: Record<RecKind, string> = {
  none: "var(--st-closed)",
  keep: "var(--st-active)",
  watch: "var(--st-near)",
  return: "var(--st-near)",
  discount: "var(--st-critical)",
  writeoff: "var(--st-expired)",
};

export const barVar: Record<BarTone, string> = {
  expired: "var(--st-expired)",
  critical: "var(--st-critical)",
  near: "var(--st-near)",
  active: "var(--st-active)",
};

export const urgencyVar: Record<Urgency, string> = {
  expired: "var(--st-expired)",
  critical: "var(--st-critical)",
  near: "var(--st-near)",
};

export function directionVar(effect: number): string {
  if (effect > 0) return "var(--st-expired)";
  if (effect < 0) return "var(--st-active)";
  return "var(--ink-3)";
}

export const roleVar: Record<CounterRole, string> = {
  "sells-first": "var(--accent)",
  waits: "var(--ink-3)",
  "in-cart": "var(--ink-3)",
  blocked: "var(--st-expired)",
  closed: "var(--st-closed)",
};

export function approvalVar(status: ApprovalStatus): string {
  return status === "approved" ? "var(--st-active)" : "var(--st-closed)";
}

export const typeVar: Record<ApprovalType, string> = {
  Return: "var(--st-near)",
  "Write-off": "var(--st-expired)",
};
