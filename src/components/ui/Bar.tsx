export function Bar({
  percent,
  color,
  height = 8,
  className = "",
}: {
  percent: number;
  color: string;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-full bg-sunk ${className}`}
      style={{ height }}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, percent))}%`, background: color }}
      />
    </div>
  );
}

export function Column({
  percent,
  color,
  maxHeight = 82,
}: {
  percent: number;
  color: string;
  maxHeight?: number;
}) {
  return (
    <div
      className="w-full rounded-t-[6px] rounded-b-[2px]"
      style={{
        height: Math.max(2, (percent / 100) * maxHeight),
        background: color,
      }}
    />
  );
}
