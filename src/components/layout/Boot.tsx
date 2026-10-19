"use client";

import { useEffect } from "react";
import { restoreSession } from "@/store/auth.thunks";
import { loadCatalogue } from "@/store/catalogue.thunks";
import { loadBooks } from "@/store/pharmacy.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectAuthStatus } from "@/store/selectors";

export function Boot() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);

  useEffect(() => {
    void dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (status !== "authed") return;
    void dispatch(loadBooks());
    void dispatch(loadCatalogue());
  }, [status, dispatch]);

  return null;
}
