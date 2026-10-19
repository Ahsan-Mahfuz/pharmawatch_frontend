import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotForm } from "@/components/auth/ForgotForm";

export const metadata: Metadata = {
  title: "Reset your password",
  alternates: { canonical: "/forgot-password" },
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="Locked out"
      title="Reset your password"
      sub="Tell us the address on the account and we will send a link that works once, for 30 minutes."
      footer={
        <>
          Remembered it? <Link href="/signin">Sign in</Link>
        </>
      }
    >
      <ForgotForm />
    </AuthCard>
  );
}
