"use client";

import { useState } from "react";
import { Card, CardHead } from "@/components/ui/Card";
import { BLANK_RECEIVE, fieldErrors, receiveSchema, type ReceiveInput } from "@/lib/schemas";
import { receiveBatch } from "@/store/pharmacy.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBusy, selectMedicines, selectSuppliers } from "@/store/selectors";
import { ReceiveFields } from "./ReceiveFields";
import { ReceiveNotice } from "./ReceiveNotice";

export function ReceiveForm({ onClose }: { onClose: () => void }) {
  const [values, setValues] = useState<ReceiveInput>(BLANK_RECEIVE);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const medicines = useAppSelector(selectMedicines);
  const suppliers = useAppSelector(selectSuppliers);
  const busy = useAppSelector(selectBusy);
  const dispatch = useAppDispatch();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = receiveSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    const result = await dispatch(receiveBatch({ ...parsed.data, batchNo: parsed.data.batchNo.toUpperCase() }));
    if (receiveBatch.rejected.match(result)) return;

    setValues(BLANK_RECEIVE);
    setErrors({});
    onClose();
  }

  const count = Object.keys(errors).length;
  const missing = !medicines.length ? "A medicine" : !suppliers.length ? "A supplier" : "";

  return (
    <Card>
      <CardHead
        title="Receive a batch"
        sub="A new delivery starts with no sales history, so it scores as unknown until it moves. The return window comes from the supplier on file."
      />
      <form onSubmit={submit} noValidate className="px-[22px] pb-[22px] max-sm:px-4">
        <ReceiveFields
          values={values}
          errors={errors}
          medicines={medicines}
          suppliers={suppliers}
          onChange={(k, v) => setValues((s) => ({ ...s, [k]: v }))}
        />

        <ReceiveNotice missing={missing} errors={count} />

        <div className="mt-4 flex flex-wrap gap-2.5">
          <button type="submit" className="btn btn-primary" disabled={busy || !!missing}>
            {busy ? "Saving…" : "Put on the shelf"}
          </button>
          <button type="button" className="btn btn-quiet" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </Card>
  );
}
