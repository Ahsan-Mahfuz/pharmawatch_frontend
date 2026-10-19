"use client";

import { useState } from "react";
import { Filters } from "@/components/batches/Filters";
import { ReceiveForm } from "@/components/batches/ReceiveForm";
import { Register } from "@/components/batches/Register";
import { useAppSelector } from "@/store/hooks";
import { selectRegisterRows } from "@/store/selectors";

export default function BatchesPage() {
  const [receiving, setReceiving] = useState(false);
  const count = useAppSelector(selectRegisterRows).length;

  return (
    <div className="screen flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <p className="eyebrow">The register</p>
          <h1 className="h2 mt-1.5">Batches</h1>
          <p className="sub">
            {count} {count === 1 ? "batch" : "batches"} shown. Select a row to open it.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setReceiving((v) => !v)}
          aria-expanded={receiving}
        >
          {receiving ? "Close form" : "Receive batch"}
        </button>
      </div>

      {receiving ? <ReceiveForm onClose={() => setReceiving(false)} /> : null}

      <Filters />
      <Register />
    </div>
  );
}
