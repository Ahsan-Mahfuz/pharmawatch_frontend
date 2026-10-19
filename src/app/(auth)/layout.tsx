import type { ReactNode } from "react";
import { AuthMark } from "@/components/auth/AuthMark";

const PEGBOARD = {
  backgroundImage: "radial-gradient(var(--line) 1px, transparent 1.3px)",
  backgroundSize: "24px 24px",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main style={PEGBOARD} className="flex min-h-dvh flex-col items-center justify-center px-5 py-12">
      <div className="flex w-full max-w-[440px] flex-col gap-6">
        <AuthMark />
        {children}
      </div>

      <p className="mt-10 text-center text-[12px] text-ink-3">
        Working prototype with sample data. The date is fixed at 19 Oct 2026.
      </p>
    </main>
  );
}
