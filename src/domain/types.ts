export type BatchState = "open" | "returned" | "written-off";

export type Batch = {
  id: string;
  ref: string;
  medId: string;
  med: string;
  gen: string;
  unit: string;
  sup: string;
  qtyIn: number;
  left: number;
  cost: number;
  price: number;
  received: string;
  expiry: string;
  cutoff: string;
  r30: number;
  r7: number;
  discount: number;
  state: BatchState;
  closedQty?: number;
};

export type ApprovalType = "Return" | "Write-off";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export type Approval = {
  id: string;
  ref: string;
  type: ApprovalType;
  batchId: string;
  med: string;
  qty: number;
  unit: string;
  value: number;
  by: string;
  date: string;
  status: ApprovalStatus;
  decidedBy: string;
};

export type Sale = {
  batchId: string;
  date: string;
  inv: string;
  by: string;
  qty: number;
  amount: number;
  disc?: number;
  full?: number;
};

export type ActivityTone = "muted" | "active" | "near" | "critical" | "expired";

export type Activity = { time: string; text: string; tone: ActivityTone };

export type Status = "active" | "near" | "critical" | "expired" | "closed";
export type Band = "High" | "Medium" | "Low" | "No";

export type Role = "pharmacist" | "owner";

export type User = { name: string; first: string; initials: string; title: string };
