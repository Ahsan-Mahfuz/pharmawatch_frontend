"use client";

import Link from "next/link";
import { statusVar } from "@/lib/colors";
import type { Status } from "@/domain";

type Props = {
  id: string;
  status: Status;
  label: string;
  children: React.ReactNode;
  onHover?: (id: string | null) => void;
};

export function Capsule({ id, status, label, children, onHover }: Props) {
  return (
    <Link
      href={`/batches/${id}`}
      className="cap flex items-center justify-center no-underline"
      style={{ color: statusVar[status] }}
      aria-label={label}
      onMouseEnter={onHover ? () => onHover(id) : undefined}
      onMouseLeave={onHover ? () => onHover(null) : undefined}
      onFocus={onHover ? () => onHover(id) : undefined}
      onBlur={onHover ? () => onHover(null) : undefined}
    >
      {children}
    </Link>
  );
}
