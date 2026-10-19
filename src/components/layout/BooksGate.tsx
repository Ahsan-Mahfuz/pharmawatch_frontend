"use client";

import type { ReactNode } from "react";
import { loadBooks } from "@/store/pharmacy.thunks";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectBookError, selectBookStatus } from "@/store/selectors";

export function BooksGate({ children }: { children: ReactNode }) {
  const status = useAppSelector(selectBookStatus);
  const error = useAppSelector(selectBookError);
  const dispatch = useAppDispatch();

  if (status === "ready") return <>{children}</>;

  if (status === "failed") {
    return (
      <div className="screen py-24 text-center">
        <p className="eyebrow">The register did not open</p>
        <p className="sub mx-auto mt-2 max-w-[42ch] text-pretty">{error}</p>
        <button
          type="button"
          className="btn btn-primary mt-4"
          onClick={() => void dispatch(loadBooks())}
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="screen py-24 text-center" aria-busy="true">
      <p className="eyebrow">Opening the register</p>
      <p className="sub mt-2">Reading batches, requests and today&rsquo;s sales.</p>
    </div>
  );
}
