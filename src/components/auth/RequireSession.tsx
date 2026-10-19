"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAppSelector } from "@/store/hooks";
import { selectAuthStatus } from "@/store/selectors";

export function RequireSession({ children }: { children: ReactNode }) {
  const status = useAppSelector(selectAuthStatus);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "anon") return;
    const next = pathname && pathname !== "/" ? `?next=${encodeURIComponent(pathname)}` : "";
    router.replace(`/signin${next}`);
  }, [status, pathname, router]);

  if (status === "authed") return <>{children}</>;

  return (
    <div className="screen py-24 text-center" aria-busy="true">
      <p className="eyebrow">{status === "booting" ? "Opening the register" : "Signing you out"}</p>
      <p className="sub mt-2">One moment.</p>
    </div>
  );
}
