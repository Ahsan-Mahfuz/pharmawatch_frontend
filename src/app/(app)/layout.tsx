import type { ReactNode } from "react";
import { RequireSession } from "@/components/auth/RequireSession";
import { BooksGate } from "@/components/layout/BooksGate";
import { Header } from "@/components/layout/Header";
import { headerStamp } from "@/lib/stamp";

const PEGBOARD = {
  backgroundImage: "radial-gradient(var(--line) 1px, transparent 1.3px)",
  backgroundSize: "24px 24px",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header stamp={headerStamp()} />
      <main style={PEGBOARD}>
        <div className="wrap">
          <RequireSession>
            <BooksGate>{children}</BooksGate>
          </RequireSession>
        </div>
      </main>
    </>
  );
}
