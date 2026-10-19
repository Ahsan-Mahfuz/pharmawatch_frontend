import { dayOf, fd, whenText } from "@/domain";
import type { Activity, ActivityTone, Approval, Batch, Sale } from "@/domain";
import type { WireActivity, WireApproval, WireBatch, WireSale } from "./wire";

const TONES: readonly string[] = ["muted", "active", "near", "critical", "expired"];

export const toBatch = (row: WireBatch): Batch => ({
  id: row.batchNo,
  ref: row.id,
  medId: row.medicine.id,
  med: [row.medicine.name, row.medicine.strength].filter(Boolean).join(" "),
  gen: row.medicine.generic,
  unit: row.unit,
  sup: row.supplier.name,
  qtyIn: row.qtyIn,
  left: row.left,
  cost: row.cost,
  price: row.price,
  received: row.received,
  expiry: row.expiry,
  cutoff: row.cutoff,
  r30: row.r30,
  r7: row.r7,
  discount: row.discount,
  state: row.state,
  closedQty: row.closedQty,
});

export const toApproval = (row: WireApproval): Approval => ({
  id: row.requestNo,
  ref: row._id,
  type: row.type === "RETURN_TO_SUPPLIER" ? "Return" : "Write-off",
  batchId: row.batchNo,
  med: row.medicineName,
  qty: row.qty,
  unit: row.unit,
  value: row.value,
  by: row.requestedByName,
  date: fd(dayOf(row.createdAt)),
  status: row.status,
  decidedBy: row.approvedByName ?? "",
});

export const toSales = (row: WireSale): Sale[] =>
  row.items.map((item) => ({
    batchId: item.batchNo,
    date: fd(dayOf(row.createdAt)),
    inv: row.invoiceNo,
    by: row.soldByName,
    qty: item.qty,
    amount: item.lineTotal,
    ...(item.discount
      ? { disc: item.discount, full: item.qty * item.fullPrice }
      : {}),
  }));

export const toActivity = (row: WireActivity): Activity => ({
  time: whenText(row.createdAt),
  text: row.text,
  tone: (TONES.includes(row.tone) ? row.tone : "muted") as ActivityTone,
});
