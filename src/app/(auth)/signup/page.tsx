import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "@/components/auth/AuthCard";
import { SignUpForm } from "@/components/auth/SignUpForm";

export const metadata: Metadata = {
  title: "Create an account",
  description: "Set up PharmaWatch for your pharmacy and start tracking stock batch by batch.",
  alternates: { canonical: "/signup" },
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <AuthCard
      eyebrow="First time here"
      title="Set up your pharmacy"
      sub="The first account owns the pharmacy and can approve returns. Staff are added afterwards and cannot approve their own requests."
      footer={
        <>
          Already have an account? <Link href="/signin">Sign in</Link>
        </>
      }
    >
      <SignUpForm />
    </AuthCard>
  );
}
