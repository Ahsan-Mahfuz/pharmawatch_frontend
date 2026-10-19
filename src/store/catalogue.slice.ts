import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import type { WireMedicine, WireSupplier } from "@/lib/api/wire";
import { signOut } from "./auth.thunks";
import { loadCatalogue, saveMedicine, saveSupplier } from "./catalogue.thunks";

export type CatalogueState = {
  medicines: WireMedicine[];
  suppliers: WireSupplier[];
  status: "idle" | "loading" | "ready" | "failed";
  busy: boolean;
  error: string;
};

const initialState: CatalogueState = {
  medicines: [],
  suppliers: [],
  status: "idle",
  busy: false,
  error: "",
};

const working = isAnyOf(saveMedicine.pending, saveSupplier.pending);
const saved = isAnyOf(saveMedicine.fulfilled, saveSupplier.fulfilled);
const refused = isAnyOf(saveMedicine.rejected, saveSupplier.rejected);

const catalogue = createSlice({
  name: "catalogue",
  initialState,
  reducers: {},

  extraReducers: (b) => {
    b.addCase(loadCatalogue.pending, (s) => {
      s.status = s.status === "ready" ? "ready" : "loading";
    });

    b.addCase(loadCatalogue.fulfilled, (s, a) => {
      s.medicines = a.payload.medicines;
      s.suppliers = a.payload.suppliers;
      s.status = "ready";
      s.error = "";
    });

    b.addCase(loadCatalogue.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload ?? "The catalogue could not be loaded.";
    });

    b.addCase(signOut.fulfilled, () => initialState);

    b.addMatcher(working, (s) => void (s.busy = true));

    b.addMatcher(saved, (s, a) => {
      s.busy = false;
      s.medicines = a.payload.catalogue.medicines;
      s.suppliers = a.payload.catalogue.suppliers;
      s.status = "ready";
    });

    b.addMatcher(refused, (s) => void (s.busy = false));
  },
});

export default catalogue.reducer;
