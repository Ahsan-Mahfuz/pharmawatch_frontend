"use client";

import { useState } from "react";
import { Cart } from "@/components/counter/Cart";
import { FefoPanel } from "@/components/counter/FefoPanel";
import { MedicineSearch } from "@/components/counter/MedicineSearch";
import { useAppSelector } from "@/store/hooks";
import { selectMedicineNames } from "@/store/selectors";

export default function CounterPage() {
  const [picked, setPicked] = useState("");
  const names = useAppSelector(selectMedicineNames);
  const med = picked || names[0] || "";

  return (
    <div className="screen flex flex-col gap-5">
      <div>
        <p className="eyebrow">Draft invoice</p>
        <h1 className="h2 mt-1.5">Counter sale</h1>
        <p className="sub">
          Pick a medicine and the counter takes stock from the batch that expires first.
          Expired stock can never reach the cart.
        </p>
      </div>

      <div className="grid items-start gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(440px,100%),1fr))]">
        <section className="card flex flex-col gap-4 px-[22px] pt-5 pb-[22px] max-sm:px-4">
          <MedicineSearch activeMed={med} onPick={setPicked} />
          {med ? <FefoPanel med={med} /> : null}
        </section>

        <Cart />
      </div>
    </div>
  );
}
