"use client";

import { useState } from "react";

type Props = {
  id: string;
  label: string;
  value: string;
  error?: string;
  autoComplete: "current-password" | "new-password";
  hint?: React.ReactNode;
  onChange: (value: string) => void;
};

export function PasswordField({
  id, label, value, error, autoComplete, hint, onChange,
}: Props) {
  const [shown, setShown] = useState(false);

  return (
    <div className="fld">
      <span className="flex items-baseline justify-between gap-3">
        <label htmlFor={id}>{label}</label>
        {hint}
      </span>

      <span className="relative block">
        <input
          id={id}
          type={shown ? "text" : "password"}
          className="inp pr-[72px]"
          value={value}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          type="button"
          className="btn btn-quiet btn-sm absolute top-1/2 right-1.5 -translate-y-1/2"
          aria-pressed={shown}
          onClick={() => setShown((v) => !v)}
        >
          {shown ? "Hide" : "Show"}
        </button>
      </span>

      {error ? (
        <span id={`${id}-err`} role="alert" className="text-[12px] text-st-expired">
          {error}
        </span>
      ) : null}
    </div>
  );
}
