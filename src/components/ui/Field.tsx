import type { ComponentProps, ReactNode } from "react";

type Base = { label: ReactNode; id: string; error?: string; hint?: ReactNode };

function Wrap({ id, label, hint, error, children }: Base & { children: ReactNode }) {
  return (
    <div className="fld">
      <label htmlFor={id}>
        {label}
        {hint ? <span className="font-normal text-ink-3"> {hint}</span> : null}
      </label>
      {children}
      {error ? (
        <span id={`${id}-err`} role="alert" className="text-[12px] text-st-expired">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function TextField({ label, id, error, hint, ...rest }: Base & ComponentProps<"input">) {
  return (
    <Wrap id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        className="inp"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : undefined}
        {...rest}
      />
    </Wrap>
  );
}

export function SelectField({
  label, id, error, hint, children, ...rest
}: Base & ComponentProps<"select">) {
  return (
    <Wrap id={id} label={label} error={error} hint={hint}>
      <select id={id} className="inp" aria-invalid={error ? true : undefined} {...rest}>
        {children}
      </select>
    </Wrap>
  );
}
