import { configureStore } from "@reduxjs/toolkit";
import auth from "./auth.slice";
import catalogue from "./catalogue.slice";
import pharmacy from "./pharmacy.slice";
import ui from "./ui.slice";

export const makeStore = () =>
  configureStore({
    reducer: { auth, catalogue, pharmacy, ui },
    devTools: process.env.NODE_ENV !== "production",
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
