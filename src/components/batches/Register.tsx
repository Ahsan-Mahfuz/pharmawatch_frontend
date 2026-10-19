"use client";

import { Card } from "@/components/ui/Card";
import { clearFilters } from "@/store/ui.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBatches, selectRegisterRows } from "@/store/selectors";
import { RegisterRow } from "./RegisterRow";

const HEADINGS = [
  "Medicine", "Supplier", "On shelf", "Shelf life", "Risk", "Status", "At risk",
];

export function Register() {
  const rows = useAppSelector(selectRegisterRows);
  const empty = useAppSelector(selectBatches).length === 0;
  const dispatch = useAppDispatch();

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[980px]">
          <div className="bgrid px-[22px] py-3 max-sm:px-4">
            {HEADINGS.map((h, i) => (
              <span key={h} className={`eyebrow ${i >= 4 ? "text-right" : ""}`}>
                {h}
              </span>
            ))}
          </div>

          {rows.length === 0 ? (
            <div className="border-t border-line px-6 py-12 text-center">
              <p className="h3">
                {empty ? "The register is empty" : "No batches match those filters"}
              </p>
              <p className="sub mx-auto max-w-[42ch]">
                {empty
                  ? "Receive your first delivery above. It needs a medicine and a supplier on file first."
                  : "Try a different supplier or status, or clear the filters to see the whole register."}
              </p>
              {empty ? null : (
                <button
                  type="button"
                  className="btn btn-sm mt-4"
                  onClick={() => dispatch(clearFilters())}
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            rows.map((batch) => <RegisterRow key={batch.id} batch={batch} />)
          )}
        </div>
      </div>
    </Card>
  );
}
