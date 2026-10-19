import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="screen py-16 text-center">
      <p className="eyebrow">404</p>
      <h1 className="h2 mt-1.5">That page is not on the shelf</h1>
      <p className="sub mx-auto max-w-[46ch]">
        The link may be old, or the batch it pointed at has been returned and cleared.
      </p>
      <Link href="/" className="btn btn-primary mt-5">
        Back to Today
      </Link>
    </div>
  );
}
