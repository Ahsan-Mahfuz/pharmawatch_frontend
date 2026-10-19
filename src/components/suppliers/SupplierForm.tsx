"use client";

import { TextField } from "@/components/ui/Field";
import { BLANK_SUPPLIER, supplierSchema, type SupplierInput } from "@/lib/schemas";
import { useRecordForm } from "@/lib/useRecordForm";
import { saveSupplier } from "@/store/catalogue.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCatalogueBusy } from "@/store/selectors";

type Props = { id?: string; initial?: SupplierInput; onDone: () => void };

export function SupplierForm({ id, initial, onDone }: Props) {
  const form = useRecordForm(supplierSchema, initial ?? BLANK_SUPPLIER);
  const busy = useAppSelector(selectCatalogueBusy);
  const dispatch = useAppDispatch();

  const field = (key: keyof SupplierInput) => ({
    id: `sup-${key}`,
    value: String(form.values[key] ?? ""),
    error: form.errors[key],
    onChange: (e: { target: { value: string } }) => form.set(key, e.target.value),
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = form.validate();
    if (!body) return;

    const result = await dispatch(saveSupplier({ ...(id ? { id } : {}), body }));
    if (saveSupplier.rejected.match(result)) {
      form.blame(result.payload?.field, result.payload?.fieldMessage);
      return;
    }
    form.reset();
    onDone();
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
      <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr))]">
        <TextField label="Supplier name" {...field("name")} />
        <TextField label="Phone" inputMode="tel" {...field("phone")} />
        <TextField label="Email" type="email" {...field("email")} />
        <TextField
          label="Return window"
          hint="days before expiry they stop taking stock back"
          type="number"
          min={0}
          max={365}
          inputMode="numeric"
          {...field("returnWindowDays")}
        />
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Saving…" : id ? "Save changes" : "Add the supplier"}
        </button>
        <button type="button" className="btn btn-quiet" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}
