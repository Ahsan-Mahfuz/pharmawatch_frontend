export function CheckboxField({
  id, checked, error, children, onChange,
}: {
  id: string;
  checked: boolean;
  error?: string;
  children: React.ReactNode;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-[13.5px]">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          className="mt-0.5 h-4 w-4 flex-none accent-[var(--accent)]"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-pretty">{children}</span>
      </label>

      {error ? (
        <span id={`${id}-err`} role="alert" className="pl-6 text-[12px] text-st-expired">
          {error}
        </span>
      ) : null}
    </div>
  );
}
