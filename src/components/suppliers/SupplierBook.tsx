"use client";

import { useState } from "react";
import type { WireSupplier } from "@/lib/api/wire";
import { Card, CardHead } from "@/components/ui/Card";
import { useAppSelector } from "@/store/hooks";
import { selectSuppliers } from "@/store/selectors";
import { SupplierForm } from "./SupplierForm";

const asInput = (row: WireSupplier) => ({
  name: row.name,
  phone: row.phone,
  email: row.email,
  returnWindowDays: String(row.returnWindowDays),
});

export function SupplierBook() {
  const [editing, setEditing] = useState<string | null>(null);
  const suppliers = useAppSelector(selectSuppliers);

  return (
    <Card>
      <CardHead
        title="Who you buy from"
        sub="The return window is the business fact that matters: miss it and the stock can only be written off."
        right={
          <button type="button" className="btn btn-sm"
            onClick={() => setEditing(editing === "new" ? null : "new")}>
            {editing === "new" ? "Close" : "Add a supplier"}
          </button>
        }
      />

      <div className="px-[22px] pb-[22px] max-sm:px-4">
        {editing === "new" ? (
          <div className="border-t border-line py-4">
            <SupplierForm onDone={() => setEditing(null)} />
          </div>
        ) : null}

        <ul aria-label="Suppliers" className="m-0 flex list-none flex-col p-0">
          {suppliers.map((row) =>
            editing === row._id ? (
              <li key={row._id} className="list-none border-t border-line py-4">
                <SupplierForm id={row._id} initial={asInput(row)} onDone={() => setEditing(null)} />
              </li>
            ) : (
              <li key={row._id}
                className="flex list-none flex-wrap items-center gap-4 border-t border-line py-3.5">
                <span className="min-w-0 flex-[1_1_240px]">
                  <span className="block truncate font-bold">{row.name}</span>
                  <span className="block truncate text-[12.5px] text-ink-3">
                    {[row.phone, row.email].filter(Boolean).join(" · ") || "no contact on file"}
                  </span>
                </span>

                <span className="num text-[13px]">
                  takes returns until{" "}
                  <strong>{row.returnWindowDays} days</strong> before expiry
                </span>

                <button type="button" className="btn btn-quiet btn-sm"
                  onClick={() => setEditing(row._id)} aria-label={`Edit ${row.name}`}>
                  Edit
                </button>
              </li>
            ),
          )}
        </ul>
      </div>
    </Card>
  );
}
