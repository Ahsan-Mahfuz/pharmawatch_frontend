"use client";

import { ALL_SUPPLIERS, SORT_NAMES, uniqueSuppliers, type SortKey, type StatusFilter } from "@/domain";
import { Seg } from "@/components/ui/Seg";
import { setQuery, setSort, setStatusFilter, setSupplier } from "@/store/ui.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBatches, selectSegmentCounts } from "@/store/selectors";

const SORTS = Object.keys(SORT_NAMES) as SortKey[];

export function Filters() {
  const dispatch = useAppDispatch();
  const { q, supplier, statusF, sort } = useAppSelector((s) => s.ui);
  const suppliers = uniqueSuppliers(useAppSelector(selectBatches));
  const segments = useAppSelector(selectSegmentCounts);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="fld flex-[1_1_220px]">
        <span>Search</span>
        <input
          type="search"
          className="inp"
          placeholder="Medicine, generic or batch number"
          value={q}
          onChange={(e) => dispatch(setQuery(e.target.value))}
        />
      </label>

      <label className="fld">
        <span>Supplier</span>
        <select
          className="inp"
          value={supplier}
          onChange={(e) => dispatch(setSupplier(e.target.value))}
        >
          <option>{ALL_SUPPLIERS}</option>
          {suppliers.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>

      <label className="fld">
        <span>Sort by</span>
        <select
          className="inp"
          value={sort}
          onChange={(e) => dispatch(setSort(e.target.value as SortKey))}
        >
          {SORTS.map((k) => (
            <option key={k} value={k}>
              {SORT_NAMES[k]}
            </option>
          ))}
        </select>
      </label>

      <Seg
        label="Status"
        options={segments}
        value={statusF}
        onChange={(k) => dispatch(setStatusFilter(k as StatusFilter))}
      />
    </div>
  );
}
