export function FormBanner({
  tone,
  children,
}: {
  tone: "bad" | "ok";
  children: React.ReactNode;
}) {
  const color = tone === "bad" ? "var(--st-expired)" : "var(--st-active)";

  return (
    <p
      role={tone === "bad" ? "alert" : "status"}
      className="m-0 flex items-start gap-2.5 rounded-xl border p-3 text-[13.5px] text-pretty"
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 35%, transparent)`,
        background: `color-mix(in srgb, ${color} 8%, transparent)`,
      }}
    >
      <span aria-hidden="true" className="mt-px font-bold">
        {tone === "bad" ? "!" : "✓"}
      </span>
      <span className="text-ink">{children}</span>
    </p>
  );
}
