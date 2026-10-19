import { z } from "zod";

const money = z.coerce.number().positive("Must be more than 0");

export const receiveSchema = z
  .object({
    medicine: z.string().min(1, "Pick a medicine"),
    supplier: z.string().min(1, "Pick a supplier"),
    batchNo: z
      .string()
      .trim()
      .regex(/^[A-Z]{2,4}-\d{3,5}$/i, "Looks like ABC-1234"),
    qtyIn: z.coerce.number().int("Whole units only").positive("Must be more than 0"),
    cost: money,
    price: money,
    expiry: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use the date picker"),
  })
  .refine((v) => v.price >= v.cost, {
    path: ["price"],
    message: "Selling below cost — check the figures",
  });

export type ReceiveInput = z.input<typeof receiveSchema>;
export type ReceiveValues = z.output<typeof receiveSchema>;

export const BLANK_RECEIVE: ReceiveInput = {
  medicine: "", supplier: "", batchNo: "", qtyIn: "", cost: "", price: "", expiry: "",
};

export const FORMS = [
  "tablet", "capsule", "syrup", "injection", "ointment", "inhaler",
] as const;

export const UNITS = [
  "strips", "caps", "tabs", "bottles", "vials", "inhalers", "sachets", "tubes",
] as const;

export const medicineSchema = z.object({
  name: z.string().trim().min(2, "Name the medicine"),
  generic: z.string().trim().min(2, "Name the generic"),
  strength: z.string().trim().max(40).default(""),
  form: z.enum(FORMS),
  manufacturer: z.string().trim().max(120).default(""),
  unit: z.enum(UNITS),
});

export type MedicineInput = z.input<typeof medicineSchema>;

export const BLANK_MEDICINE: MedicineInput = {
  name: "", generic: "", strength: "", form: "tablet", manufacturer: "", unit: "strips",
};

export const supplierSchema = z.object({
  name: z.string().trim().min(2, "Name the supplier"),
  phone: z.string().trim().max(20).default(""),
  email: z.string().trim().email("Enter a valid email").or(z.literal("")).default(""),
  returnWindowDays: z.coerce
    .number()
    .int("Whole days only")
    .min(0, "Cannot be negative")
    .max(365, "That window is too long"),
});

export type SupplierInput = z.input<typeof supplierSchema>;

export const BLANK_SUPPLIER: SupplierInput = {
  name: "", phone: "", email: "", returnWindowDays: "90",
};

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
