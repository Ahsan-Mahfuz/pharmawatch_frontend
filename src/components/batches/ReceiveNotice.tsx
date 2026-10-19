"use client";

import Link from "next/link";

export function ReceiveNotice({ missing, errors }: { missing: string; errors: number }) {
  if (missing) {
    return (
      <p className="mt-3 text-[13px] text-ink-2">
        {missing} is not on file yet.{" "}
        <Link href={missing === "A supplier" ? "/suppliers" : "/medicines"} className="font-semibold">
          Add it first
        </Link>{" "}
        — a batch has to belong to something.
      </p>
    );
  }

  if (!errors) return null;

  return (
    <p role="alert" className="mt-3 text-[13px] text-st-expired">
      {errors} field{errors === 1 ? " needs" : "s need"} fixing before this batch can go on
      the shelf.
    </p>
  );
}
