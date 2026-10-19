import type { Activity, Approval, Batch, Sale } from "@/domain";
import { api } from "./client";
import { toActivity, toApproval, toBatch, toSales } from "./map";
import type {
  WireActivity,
  WireApproval,
  WireBatch,
  WireMedicine,
  WireSale,
  WireSupplier,
} from "./wire";

const PAGE = "limit=100";

export type Books = {
  batches: Batch[];
  approvals: Approval[];
  sales: Sale[];
  activity: Activity[];
};

export async function fetchBooks(): Promise<Books> {
  const [batches, approvals, sales, activity] = await Promise.all([
    api<WireBatch[]>(`/batches?${PAGE}&status=all&sort=days`),
    api<WireApproval[]>(`/stock-actions?${PAGE}`),
    api<WireSale[]>(`/sales?${PAGE}`),
    api<WireActivity[]>(`/activity?limit=20`),
  ]);

  return {
    batches: batches.map(toBatch),
    approvals: approvals.map(toApproval),
    sales: sales.flatMap(toSales),
    activity: activity.map(toActivity),
  };
}

export const fetchMedicines = () => api<WireMedicine[]>(`/medicines?${PAGE}`);
export const fetchSuppliers = () => api<WireSupplier[]>(`/suppliers?${PAGE}`);

export const putDiscount = (ref: string, percent: number) =>
  api(`/batches/${ref}/discount`, { body: { percent } });

export const postStockAction = (ref: string, type: Approval["type"], reason: string) =>
  api(`/stock-actions`, {
    body: {
      batch: ref,
      type: type === "Return" ? "RETURN_TO_SUPPLIER" : "WRITE_OFF",
      reason,
    },
  });

export const patchDecision = (ref: string, approve: boolean) =>
  api(`/stock-actions/${ref}/${approve ? "approve" : "reject"}`, {
    method: "PATCH",
    body: {},
  });

export type SaleLine = { medicine: string; qty: number };

export const postSale = (items: SaleLine[]) =>
  api<{ invoiceNo: string; total: number }>(`/sales`, { body: { items } });

export type ReceiveBody = {
  batchNo: string;
  medicine: string;
  supplier: string;
  qtyIn: number;
  cost: number;
  price: number;
  expiry: string;
};

export const postBatch = (body: ReceiveBody) =>
  api<WireBatch>(`/batches`, { body });
