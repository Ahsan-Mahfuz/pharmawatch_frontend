import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { ALL_SUPPLIERS, type SortKey, type StatusFilter } from "@/domain";

export type UiState = {
  q: string;
  supplier: string;
  statusF: StatusFilter;
  sort: SortKey;
  range: 12 | 6;
  hoverId: string | null;
  pct: number | null;
  sim: { days: number; left: number; qtyIn: number; rate: number };
};

const initialState: UiState = {
  q: "",
  supplier: ALL_SUPPLIERS,
  statusF: "shelf",
  sort: "days",
  range: 12,
  hoverId: null,
  pct: null,
  sim: { days: 26, left: 88, qtyIn: 500, rate: 0.7 },
};

const ui = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setQuery: (s, a: PayloadAction<string>) => void (s.q = a.payload),
    setSupplier: (s, a: PayloadAction<string>) => void (s.supplier = a.payload),
    setStatusFilter: (s, a: PayloadAction<StatusFilter>) => void (s.statusF = a.payload),
    setSort: (s, a: PayloadAction<SortKey>) => void (s.sort = a.payload),
    setRange: (s, a: PayloadAction<12 | 6>) => void (s.range = a.payload),
    setHover: (s, a: PayloadAction<string | null>) => void (s.hoverId = a.payload),
    setPct: (s, a: PayloadAction<number | null>) => void (s.pct = a.payload),

    setSim: (s, a: PayloadAction<Partial<UiState["sim"]>>) => {
      s.sim = { ...s.sim, ...a.payload };
    },

    clearFilters: (s) => {
      s.q = "";
      s.supplier = ALL_SUPPLIERS;
      s.statusF = "shelf";
    },

    filterBySupplier: (s, a: PayloadAction<string>) => {
      s.supplier = a.payload;
      s.statusF = "shelf";
      s.q = "";
    },
  },
});

export const {
  setQuery, setSupplier, setStatusFilter, setSort, setRange,
  setHover, setPct, setSim, clearFilters, filterBySupplier,
} = ui.actions;

export default ui.reducer;
