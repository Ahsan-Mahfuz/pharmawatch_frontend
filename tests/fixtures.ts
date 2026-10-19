import { getToday } from "@/domain";
import type { Approval, Batch, Sale } from "@/domain";

const DAY = 86_400_000;

export function offset(days: number): string {
  const [y, m, d] = getToday().split("-").map(Number);
  return new Date(Date.UTC(y!, m! - 1, d!) + days * DAY).toISOString().slice(0, 10);
}

type Row = [
  id: string, med: string, gen: string, unit: string, sup: string,
  qtyIn: number, left: number, cost: number, price: number,
  received: number, expiry: number, cutoff: number, r30: number, r7: number,
  discount: number,
];

const ROWS: Row[] = [
  ["VNT-0917", "Ventolin Inhaler", "Salbutamol 100mcg", "inhalers", "Square Pharma", 60, 12, 320, 400, -343, 18, -96, 0.25, 0.14, 15],
  ["NPX-4417", "Napa Extra 500mg", "Paracetamol + Caffeine", "strips", "Beximco Pharma", 500, 88, 42, 63, -249, 26, -64, 0.9, 0.4, 0],
  ["NPX-5102", "Napa Extra 500mg", "Paracetamol + Caffeine", "strips", "Beximco Pharma", 300, 240, 42, 63, -110, 166, 76, 1.1, 1.4, 0],
  ["NPX-5533", "Napa Extra 500mg", "Paracetamol + Caffeine", "strips", "Beximco Pharma", 500, 500, 42, 63, -14, 338, 246, 1.6, 1.5, 0],
  ["SEC-2210", "Seclo 20mg", "Omeprazole", "caps", "Incepta", 600, 140, 20, 30, -272, 45, 22, 2.1, 1.6, 0],
  ["SEC-1180", "Seclo 20mg", "Omeprazole", "caps", "Incepta", 400, 14, 20, 30, -383, -19, -111, 0, 0, 0],
  ["MON-8803", "Monas 10mg", "Montelukast", "strips", "Beximco Pharma", 200, 64, 110, 150, -232, 64, 42, 0.7, 0.5, 0],
  ["MXP-3390", "Maxpro 20mg", "Esomeprazole", "caps", "Renata", 300, 18, 63, 84, -413, -18, -110, 0, 0, 0],
  ["CEF-7741", "Cef-3 200mg", "Cefixime", "caps", "Incepta", 500, 302, 35, 45, -168, 168, 78, 2.4, 2.6, 0],
];

export const SHELF: Batch[] = ROWS.map(
  ([id, med, gen, unit, sup, qtyIn, left, cost, price, received, expiry, cutoff, r30, r7, discount]) => ({
    id,
    ref: id.toLowerCase(),
    medId: med.toLowerCase().replace(/\W+/g, "-"),
    med, gen, unit, sup, qtyIn, left, cost, price,
    received: offset(received),
    expiry: offset(expiry),
    cutoff: offset(cutoff),
    r30, r7, discount,
    state: "open",
  }),
);

export const REQUESTS: Approval[] = [
  { id: "REQ-313", ref: "req-313", type: "Return", batchId: "MON-8803", med: "Monas 10mg", qty: 64, unit: "strips", value: 7040, by: "Rafiq Ahmed", date: "18 Oct 2026", status: "pending", decidedBy: "" },
  { id: "REQ-311", ref: "req-311", type: "Write-off", batchId: "MXP-3390", med: "Maxpro 20mg", qty: 18, unit: "caps", value: 1134, by: "Nasrin Akter", date: "17 Oct 2026", status: "pending", decidedBy: "" },
  { id: "REQ-308", ref: "req-308", type: "Return", batchId: "ORS-2207", med: "Orsaline-N", qty: 120, unit: "sachets", value: 600, by: "Nasrin Akter", date: "09 Oct 2026", status: "approved", decidedBy: "Mahmuda Khatun" },
];

export const TILL: Sale[] = [
  { batchId: "NPX-4417", date: "17 Oct 2026", inv: "INV-10422", by: "Rafiq Ahmed", qty: 2, amount: 126 },
  { batchId: "VNT-0917", date: "14 Oct 2026", inv: "INV-10395", by: "Nasrin Akter", qty: 1, amount: 340, disc: 15, full: 400 },
  { batchId: "NPX-4417", date: "12 Oct 2026", inv: "INV-10371", by: "Rafiq Ahmed", qty: 4, amount: 252 },
];
