export type WireBatch = {
  id: string;
  batchNo: string;
  medicine: { id: string; name: string; generic: string; strength: string };
  supplier: { id: string; name: string };
  unit: string;
  qtyIn: number;
  left: number;
  cost: number;
  price: number;
  discount: number;
  received: string;
  expiry: string;
  cutoff: string;
  state: "open" | "returned" | "written-off";
  closedQty: number;
  r30: number;
  r7: number;
};

export type WireApproval = {
  _id: string;
  requestNo: string;
  type: "RETURN_TO_SUPPLIER" | "WRITE_OFF";
  batch: string;
  batchNo: string;
  medicineName: string;
  qty: number;
  unit: string;
  value: number;
  requestedByName: string;
  approvedByName?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};

export type WireSaleItem = {
  batchNo: string;
  qty: number;
  unitPrice: number;
  fullPrice: number;
  discount: number;
  lineTotal: number;
};

export type WireSale = {
  invoiceNo: string;
  soldByName: string;
  items: WireSaleItem[];
  createdAt: string;
};

export type WireActivity = { text: string; tone: string; createdAt: string };

export type WireAccount = {
  id: string;
  name: string;
  email: string;
  role: "owner" | "pharmacist";
  pharmacy: string;
};

export type WireSession = { account: WireAccount; accessToken: string };

export type WireMedicine = {
  _id: string;
  name: string;
  generic: string;
  strength: string;
  form: string;
  manufacturer: string;
  unit: string;
};

export type WireSupplier = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  returnWindowDays: number;
};
