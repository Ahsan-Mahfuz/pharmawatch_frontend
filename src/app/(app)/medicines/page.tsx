"use client";

import { useState } from "react";
import { CatalogueList } from "@/components/medicines/CatalogueList";
import { MedicineForm } from "@/components/medicines/MedicineForm";
import { Card, CardHead } from "@/components/ui/Card";

export default function MedicinesPage() {
  const [adding, setAdding] = useState(false);

  return (
    <div className="screen flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3.5">
        <div>
          <p className="eyebrow">The catalogue</p>
          <h1 className="h2 mt-1.5">Medicines</h1>
          <p className="sub">
            What this pharmacy stocks. A batch can only be received against a medicine
            that is listed here.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setAdding((v) => !v)}
          aria-expanded={adding}
        >
          {adding ? "Close form" : "Add a medicine"}
        </button>
      </div>

      {adding ? (
        <Card>
          <CardHead
            title="New medicine"
            sub="The brand, the generic behind it, and the unit the counter sells it in."
          />
          <div className="px-[22px] pb-[22px] max-sm:px-4">
            <MedicineForm onDone={() => setAdding(false)} />
          </div>
        </Card>
      ) : null}

      <CatalogueList />
    </div>
  );
}
