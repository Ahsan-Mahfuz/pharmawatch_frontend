import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Approval } from "@/domain";
import { messageOf } from "@/lib/api/error";
import {
  fetchBooks,
  patchDecision,
  postBatch,
  postSale,
  postStockAction,
  putDiscount,
  type Books,
  type ReceiveBody,
  type SaleLine,
} from "@/lib/api/pharmacy";

export type Done = { books: Books; message: string };

const act = <Arg>(name: string, run: (arg: Arg) => Promise<string>) =>
  createAsyncThunk<Done, Arg, { rejectValue: string }>(
    `pharmacy/${name}`,
    async (arg, { rejectWithValue }) => {
      let message: string;
      try {
        message = await run(arg);
      } catch (error) {
        return rejectWithValue(messageOf(error));
      }
      return { books: await fetchBooks(), message };
    },
  );

export const loadBooks = createAsyncThunk<Books, void, { rejectValue: string }>(
  "pharmacy/load",
  async (_arg, { rejectWithValue }) => {
    try {
      return await fetchBooks();
    } catch (error) {
      return rejectWithValue(messageOf(error));
    }
  },
);

export const applyDiscount = act<{ ref: string; id: string; pct: number }>(
  "discount",
  async ({ ref, id, pct }) => {
    await putDiscount(ref, pct);
    return `${pct}% off is live on ${id}.`;
  },
);

export const requestAction = act<{ ref: string; id: string; type: Approval["type"] }>(
  "request",
  async ({ ref, id, type }) => {
    await postStockAction(ref, type, "");
    return `${type} requested for ${id}. Waiting on the owner.`;
  },
);

export const decide = act<{ ref: string; id: string; approve: boolean }>(
  "decide",
  async ({ ref, id, approve }) => {
    await patchDecision(ref, approve);
    return `${id} ${approve ? "approved" : "rejected"}.`;
  },
);

export const completeSale = act<SaleLine[]>("sale", async (items) => {
  const sale = await postSale(items);
  return `Sale recorded · ৳${Math.round(sale.total).toLocaleString("en-IN")} · ${sale.invoiceNo}`;
});

export const receiveBatch = act<ReceiveBody>("receive", async (body) => {
  const batch = await postBatch(body);
  return `${batch.batchNo} is on the shelf.`;
});
