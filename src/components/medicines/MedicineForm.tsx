"use client";

import { SelectField, TextField } from "@/components/ui/Field";
import { BLANK_MEDICINE, FORMS, UNITS, medicineSchema, type MedicineInput } from "@/lib/schemas";
import { useRecordForm } from "@/lib/useRecordForm";
import { saveMedicine } from "@/store/catalogue.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectCatalogueBusy } from "@/store/selectors";

type Props = { id?: string; initial?: MedicineInput; onDone: () => void };

export function MedicineForm({ id, initial, onDone }: Props) {
  const form = useRecordForm(medicineSchema, initial ?? BLANK_MEDICINE);
  const busy = useAppSelector(selectCatalogueBusy);
  const dispatch = useAppDispatch();

  const field = (key: keyof MedicineInput) => ({
    id: `med-${key}`,
    value: String(form.values[key] ?? ""),
    error: form.errors[key],
    onChange: (e: { target: { value: string } }) => form.set(key, e.target.value),
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const body = form.validate();
    if (!body) return;

    const result = await dispatch(saveMedicine({ ...(id ? { id } : {}), body }));
    if (saveMedicine.rejected.match(result)) {
      form.blame(result.payload?.field, result.payload?.fieldMessage);
      return;
    }
    form.reset();
    onDone();
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-3.5">
      <div className="grid gap-3.5 [grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr))]">
        <TextField label="Brand name" {...field("name")} />
        <TextField label="Generic" {...field("generic")} />
        <TextField label="Strength" hint="as printed on the pack" {...field("strength")} />
        <TextField label="Manufacturer" {...field("manufacturer")} />

        <SelectField label="Form" {...field("form")}>
          {FORMS.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </SelectField>

        <SelectField label="Counted in" {...field("unit")}>
          {UNITS.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </SelectField>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy ? "Saving…" : id ? "Save changes" : "Add to the catalogue"}
        </button>
        <button type="button" className="btn btn-quiet" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}
