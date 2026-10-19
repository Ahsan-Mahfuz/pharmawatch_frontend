import { api } from "./client";
import type { WireMedicine, WireSupplier } from "./wire";

const PAGE = "limit=100";

export type Catalogue = { medicines: WireMedicine[]; suppliers: WireSupplier[] };

export async function fetchCatalogue(): Promise<Catalogue> {
  const [medicines, suppliers] = await Promise.all([
    api<WireMedicine[]>(`/medicines?${PAGE}`),
    api<WireSupplier[]>(`/suppliers?${PAGE}`),
  ]);
  return { medicines, suppliers };
}

export type MedicineBody = {
  name: string;
  generic: string;
  strength: string;
  form: string;
  manufacturer: string;
  unit: string;
};

export const postMedicine = (body: MedicineBody) =>
  api<WireMedicine>("/medicines", { body });

export const patchMedicine = (id: string, body: MedicineBody) =>
  api<WireMedicine>(`/medicines/${id}`, { method: "PATCH", body });

export type SupplierBody = {
  name: string;
  phone: string;
  email: string;
  returnWindowDays: number;
};

export const postSupplier = (body: SupplierBody) =>
  api<WireSupplier>("/suppliers", { body });

export const patchSupplier = (id: string, body: SupplierBody) =>
  api<WireSupplier>(`/suppliers/${id}`, { method: "PATCH", body });

export type WireModelInfo = {
  version: number;
  question: string;
  features: { name: string; definition: string }[];
  sellRate: string;
  weights: { feature: string; weight: number }[];
  evaluation: {
    sampleSize: number;
    split: string;
    model: { accuracy: number; precision: number; recall: number; f1: number };
    baseline: { accuracy: number; precision: number; recall: number; f1: number };
    baselineRule: string;
  };
  limitations: string[];
};

export const fetchModelInfo = () => api<WireModelInfo>("/predictions/model-info");
