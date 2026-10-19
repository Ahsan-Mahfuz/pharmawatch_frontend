"use client";

import { SelectField, TextField } from "@/components/ui/Field";
import type { WireMedicine, WireSupplier } from "@/lib/api/wire";
import type { ReceiveInput } from "@/lib/schemas";

type Props = {
  values: ReceiveInput;
  errors: Record<string, string>;
  medicines: readonly WireMedicine[];
  suppliers: readonly WireSupplier[];
  onChange: (key: keyof ReceiveInput, value: string) => void;
};

export function ReceiveFields({ values, errors, medicines, suppliers, onChange }: Props) {
  const field = (key: keyof ReceiveInput) => ({
    id: `rcv-${key}`,
    value: String(values[key] ?? ""),
    error: errors[key],
    onChange: (e: { target: { value: string } }) => onChange(key, e.target.value),
  });

  return (
    <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(200px,100%),1fr))]">
      <SelectField label="Medicine" {...field("medicine")}>
        <option value="">Choose a medicine</option>
        {medicines.map((m) => (
          <option key={m._id} value={m._id}>
            {m.name} {m.strength} · {m.generic}
          </option>
        ))}
      </SelectField>

      <SelectField label="Supplier" {...field("supplier")}>
        <option value="">Choose a supplier</option>
        {suppliers.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name} · takes returns {s.returnWindowDays} days before expiry
          </option>
        ))}
      </SelectField>

      <TextField label="Batch number" hint="as printed, like ABC-1234" {...field("batchNo")} />
      <TextField label="Quantity" type="number" min={1} inputMode="numeric" {...field("qtyIn")} />
      <TextField label="Cost per unit" type="number" min={0} step="0.01" {...field("cost")} />
      <TextField label="Counter price" type="number" min={0} step="0.01" {...field("price")} />
      <TextField label="Expires" type="date" {...field("expiry")} />
    </div>
  );
}
