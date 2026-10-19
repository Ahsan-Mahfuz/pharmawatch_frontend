"use client";

import { useEffect } from "react";
import { dismissToast } from "@/store/pharmacy.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectToast } from "@/store/selectors";

const LIFETIME = 4200;

export function Toast() {
  const toast = useAppSelector(selectToast);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dispatch(dismissToast()), LIFETIME);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-line bg-paper px-4 py-2.5 text-[13.5px] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]"
    >
      <span
        aria-hidden="true"
        className="size-2 shrink-0 rounded-full"
        style={{ background: toast.kind === "ok" ? "var(--st-active)" : "var(--st-expired)" }}
      />
      <span className="text-ink">{toast.text}</span>
    </div>
  );
}
