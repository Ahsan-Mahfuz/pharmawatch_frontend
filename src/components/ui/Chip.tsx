import type { Status } from "@/domain";
import { statusVar } from "@/lib/colors";

type Props = {
  children: React.ReactNode;
  color: string;
  className?: string;
};

export function Chip({ children, color, className = "" }: Props) {
  return (
    <span className={`chip ${className}`} style={{ color }}>
      <i aria-hidden="true" />
      {children}
    </span>
  );
}

export function StatusChip({ status, label }: { status: Status; label: string }) {
  return <Chip color={statusVar[status]}>{label}</Chip>;
}
