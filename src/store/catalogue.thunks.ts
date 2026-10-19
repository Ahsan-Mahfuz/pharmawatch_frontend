import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiError } from "@/lib/api/error";
import {
  fetchCatalogue, patchMedicine, patchSupplier, postMedicine, postSupplier,
  type Catalogue, type MedicineBody, type SupplierBody,
} from "@/lib/api/catalogue";

export type Saved = { catalogue: Catalogue; message: string };
export type Refusal = { message: string; field?: string; fieldMessage?: string };

const asRefusal = (error: unknown): Refusal =>
  error instanceof ApiError
    ? {
        message: error.message,
        ...(error.field ? { field: error.field } : {}),
        ...(error.fieldMessage ? { fieldMessage: error.fieldMessage } : {}),
      }
    : { message: "That could not be saved. Please try again." };

const save = <Arg>(name: string, run: (arg: Arg) => Promise<string>) =>
  createAsyncThunk<Saved, Arg, { rejectValue: Refusal }>(
    `catalogue/${name}`,
    async (arg, { rejectWithValue }) => {
      let message: string;
      try {
        message = await run(arg);
      } catch (error) {
        return rejectWithValue(asRefusal(error));
      }
      return { catalogue: await fetchCatalogue(), message };
    },
  );

export const loadCatalogue = createAsyncThunk<Catalogue, void, { rejectValue: string }>(
  "catalogue/load",
  async (_arg, { rejectWithValue }) => {
    try {
      return await fetchCatalogue();
    } catch (error) {
      return rejectWithValue(asRefusal(error).message);
    }
  },
);

export const saveMedicine = save<{ id?: string; body: MedicineBody }>(
  "medicine",
  async ({ id, body }) => {
    const row = id ? await patchMedicine(id, body) : await postMedicine(body);
    return `${row.name} ${row.strength} is ${id ? "saved" : "in the catalogue"}.`;
  },
);

export const saveSupplier = save<{ id?: string; body: SupplierBody }>(
  "supplier",
  async ({ id, body }) => {
    const row = id ? await patchSupplier(id, body) : await postSupplier(body);
    return `${row.name} is ${id ? "saved" : "on the supplier list"}.`;
  },
);
