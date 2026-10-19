"use client";

import { supplierCards } from "@/domain";
import { ReturnWindows } from "@/components/suppliers/ReturnWindows";
import { SupplierBook } from "@/components/suppliers/SupplierBook";
import { SupplierCard } from "@/components/suppliers/SupplierCard";
import { useAppSelector } from "@/store/hooks";
import { selectBatches, selectOpenBatches } from "@/store/selectors";

export default function SuppliersPage() {
  const cards = supplierCards(
    useAppSelector(selectBatches),
    useAppSelector(selectOpenBatches),
  );

  return (
    <div className="screen flex flex-col gap-5">
      <div>
        <p className="eyebrow">Buying and returns</p>
        <h1 className="h2 mt-1.5">Suppliers</h1>
        <p className="sub">
          Who you buy from, what can still go back, and where unsold stock is piling up.
        </p>
      </div>

      <ReturnWindows />

      <SupplierBook />

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(300px,100%),1fr))]">
        {cards.map((card) => (
          <SupplierCard key={card.name} data={card} />
        ))}
      </div>
    </div>
  );
}
