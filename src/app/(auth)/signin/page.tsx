import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignInForm } from "@/components/auth/SignInForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to PharmaWatch to see which stock is about to expire unsold.",
  alternates: { canonical: "/signin" },
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Sign in"
      sub="The counter, the register and the approvals queue are all behind this door."
      footer={
        <>
          No account yet? <Link href="/signup">Set up your pharmacy</Link>
        </>
      }
    >
      <Suspense fallback={null}>
        <SignInForm />
      </Suspense>
    </AuthCard>
  );
}
