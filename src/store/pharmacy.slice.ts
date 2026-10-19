import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import type { Activity, Approval, Batch, Role, Sale } from "@/domain";
import { restoreSession, signIn, signOut, signUp } from "./auth.thunks";
import { saveMedicine, saveSupplier } from "./catalogue.thunks";
import { nextSellable } from "./pharmacy.ops";
import {
  applyDiscount, completeSale, decide, loadBooks, receiveBatch, requestAction,
} from "./pharmacy.thunks";

export type CartLine = { id: string; qty: number };
export type Toast = { text: string; kind: "ok" | "bad" } | null;
export type BookStatus = "idle" | "loading" | "ready" | "failed";

export type PharmacyState = {
  role: Role;
  batches: Batch[];
  approvals: Approval[];
  sales: Sale[];
  activity: Activity[];
  cart: CartLine[];
  status: BookStatus;
  error: string;
  busy: boolean;
  toast: Toast;
};

const initialState: PharmacyState = {
  role: "pharmacist",
  batches: [],
  approvals: [],
  sales: [],
  activity: [],
  cart: [],
  status: "idle",
  error: "",
  busy: false,
  toast: null,
};

const working = isAnyOf(
  applyDiscount.pending, requestAction.pending, decide.pending,
  completeSale.pending, receiveBatch.pending,
);

const settled = isAnyOf(
  applyDiscount.fulfilled, requestAction.fulfilled, decide.fulfilled,
  completeSale.fulfilled, receiveBatch.fulfilled,
);

const refused = isAnyOf(
  applyDiscount.rejected, requestAction.rejected, decide.rejected,
  completeSale.rejected, receiveBatch.rejected,
);

const pharmacy = createSlice({
  name: "pharmacy",
  initialState,
  reducers: {
    addMedicine: (s, a: PayloadAction<string>) => {
      const pick = nextSellable(s.batches, s.cart, a.payload);
      if (!pick) {
        s.toast = { text: `No sellable batch of ${a.payload} is left.`, kind: "bad" };
        return;
      }
      const line = s.cart.find((l) => l.id === pick.id);
      if (line) line.qty += 1;
      else s.cart.push({ id: pick.id, qty: 1 });
    },

    incLine: (s, a: PayloadAction<string>) => {
      const line = s.cart.find((l) => l.id === a.payload);
      const b = s.batches.find((x) => x.id === a.payload);
      if (!line || !b) return;
      if (line.qty >= b.left) {
        s.toast = { text: `Only ${b.left} ${b.unit} of ${b.id} are on the shelf.`, kind: "bad" };
        return;
      }
      line.qty += 1;
    },

    decLine: (s, a: PayloadAction<string>) => {
      const line = s.cart.find((l) => l.id === a.payload);
      if (!line) return;
      if (line.qty <= 1) s.cart = s.cart.filter((l) => l.id !== a.payload);
      else line.qty -= 1;
    },

    removeLine: (s, a: PayloadAction<string>) => {
      s.cart = s.cart.filter((l) => l.id !== a.payload);
    },

    clearCart: (s) => void (s.cart = []),
    dismissToast: (s) => void (s.toast = null),
  },

  extraReducers: (b) => {
    b.addCase(loadBooks.pending, (s) => {
      s.status = s.status === "ready" ? "ready" : "loading";
      s.error = "";
    });

    b.addCase(loadBooks.fulfilled, (s, a) => {
      Object.assign(s, a.payload);
      s.status = "ready";
      s.error = "";
    });

    b.addCase(loadBooks.rejected, (s, a) => {
      s.status = "failed";
      s.error = a.payload ?? "The register could not be loaded.";
    });

    b.addCase(completeSale.fulfilled, (s) => void (s.cart = []));

    b.addCase(restoreSession.fulfilled, (s, a) => {
      if (a.payload) s.role = a.payload.role;
    });
    b.addCase(signIn.fulfilled, adoptRole);
    b.addCase(signUp.fulfilled, adoptRole);
    b.addCase(signOut.fulfilled, () => initialState);

    b.addMatcher(working, (s) => {
      s.busy = true;
      s.toast = null;
    });

    b.addMatcher(settled, (s, a) => {
      s.busy = false;
      Object.assign(s, a.payload.books);
      s.status = "ready";
      s.toast = { text: a.payload.message, kind: "ok" };
    });

    b.addMatcher(refused, (s, a) => {
      s.busy = false;
      s.toast = { text: a.payload ?? "That did not go through.", kind: "bad" };
    });

    b.addMatcher(isAnyOf(saveMedicine.fulfilled, saveSupplier.fulfilled), (s, a) => {
      s.toast = { text: a.payload.message, kind: "ok" };
    });

    b.addMatcher(isAnyOf(saveMedicine.rejected, saveSupplier.rejected), (s, a) => {
      s.toast = { text: a.payload?.message ?? "That could not be saved.", kind: "bad" };
    });
  },
});

function adoptRole(s: PharmacyState, a: { payload: { role: Role } }) {
  s.role = a.payload.role;
}

export const { addMedicine, incLine, decLine, removeLine, clearCart, dismissToast } =
  pharmacy.actions;

export default pharmacy.reducer;
