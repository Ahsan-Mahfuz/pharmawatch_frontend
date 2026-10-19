import { createSelector } from "@reduxjs/toolkit";
import {
  SEGMENTS, approvalQueue, decideToday, enrich, searchBatches, sortBatches, todayLedger,
  uniqueMedicines, type EnrichedBatch,
} from "@/domain";
import type { RootState } from "./index";

const pharmacyOf = (s: RootState) => s.pharmacy;
const uiOf = (s: RootState) => s.ui;

export const selectRole = (s: RootState) => s.pharmacy.role;

export const selectAccount = (s: RootState) => s.auth.user;
export const selectAuthStatus = (s: RootState) => s.auth.status;
export const selectAuthBusy = (s: RootState) => s.auth.busy;
export const selectAuthFailure = (s: RootState) => s.auth.failure;
export const selectResetState = createSelector(
  [(s: RootState) => s.auth.resetSent, (s: RootState) => s.auth.resetDone,
   (s: RootState) => s.auth.devToken],
  (sent, done, devToken) => ({ sent, done, devToken }),
);
export const selectMedicines = (s: RootState) => s.catalogue.medicines;
export const selectSuppliers = (s: RootState) => s.catalogue.suppliers;
export const selectCatalogueBusy = (s: RootState) => s.catalogue.busy;
export const selectCatalogueReady = (s: RootState) => s.catalogue.status === "ready";

export const selectBookStatus = (s: RootState) => s.pharmacy.status;
export const selectBookError = (s: RootState) => s.pharmacy.error;
export const selectBusy = (s: RootState) => s.pharmacy.busy;
export const selectToast = (s: RootState) => s.pharmacy.toast;
export const selectCart = (s: RootState) => s.pharmacy.cart;
export const selectSim = (s: RootState) => s.ui.sim;
export const selectActivity = (s: RootState) => s.pharmacy.activity;
export const selectSales = (s: RootState) => s.pharmacy.sales;
export const selectApprovals = (s: RootState) => s.pharmacy.approvals;

export const selectBatches = createSelector(
  [(s: RootState) => s.pharmacy.batches, selectApprovals],
  (batches, approvals) => batches.map((b) => enrich(b, approvals)),
);

export const selectOpenBatches = createSelector(selectBatches, (all) =>
  all.filter((b) => !b.closed),
);

export const selectBatchMap = createSelector(
  selectBatches,
  (all) => new Map(all.map((b) => [b.id, b])),
);

export const selectBatchById = (id: string) =>
  createSelector(selectBatchMap, (map) => map.get(id));

export const selectPendingApprovals = createSelector(selectApprovals, (list) =>
  list.filter((a) => a.status === "pending"),
);

export const selectApprovalQueue = createSelector(
  [selectApprovals, selectRole, selectAccount],
  (approvals, role, account) => approvalQueue(approvals, role, account?.name ?? ""),
);

export const selectDecideToday = createSelector(selectOpenBatches, decideToday);

export const selectLedger = createSelector(
  [selectOpenBatches, selectApprovals, selectSales],
  todayLedger,
);

export const selectCartUnits = createSelector(selectCart, (cart) =>
  cart.reduce((a, l) => a + l.qty, 0),
);

const selectFiltered = createSelector(
  [selectBatches, uiOf],
  (all, ui) => searchBatches(all, ui.q, ui.supplier),
);

export const selectSegmentCounts = createSelector(selectFiltered, (base) =>
  SEGMENTS.map((seg) => ({
    key: seg.key,
    label: seg.label,
    count: base.filter(seg.match).length,
  })),
);

export const selectRegisterRows = createSelector(
  [selectFiltered, uiOf],
  (base, ui) => {
    const seg = SEGMENTS.find((x) => x.key === ui.statusF) ?? SEGMENTS[0]!;
    return sortBatches(base.filter(seg.match), ui.sort);
  },
);

export const selectCartLines = createSelector(
  [selectCart, selectBatchMap],
  (cart, map) =>
    cart.flatMap((line) => {
      const batch = map.get(line.id);
      return batch ? [{ line, batch, amount: line.qty * batch.priceNow }] : [];
    }),
);

export const selectCartTotal = createSelector(selectCartLines, (lines) =>
  lines.reduce((a, l) => a + l.amount, 0),
);

export const selectSaleLines = createSelector(selectCartLines, (lines) => {
  const byMedicine = new Map<string, number>();
  for (const { line, batch } of lines) {
    byMedicine.set(batch.medId, (byMedicine.get(batch.medId) ?? 0) + line.qty);
  }
  return [...byMedicine].map(([medicine, qty]) => ({ medicine, qty }));
});

export const selectMedicineNames = createSelector(selectBatches, uniqueMedicines);

export type { EnrichedBatch };
export { pharmacyOf, uiOf };
