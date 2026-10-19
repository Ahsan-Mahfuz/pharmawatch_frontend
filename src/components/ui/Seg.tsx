"use client";

type Option<T extends string> = { key: T; label: string; count?: number };

type Props<T extends string> = {
  label: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (key: T) => void;
};

export function Seg<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          aria-pressed={o.key === value}
          onClick={() => onChange(o.key)}
        >
          {o.label}
          {o.count === undefined ? null : (
            <span className="num text-[11px] opacity-70">{o.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
