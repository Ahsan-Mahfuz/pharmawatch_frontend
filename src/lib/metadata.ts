import type { Metadata, Viewport } from "next";

export const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const DESCRIPTION =
  "Track pharmacy stock batch by batch, see which medicine will expire unsold, and " +
  "return or discount it while there is still time.";

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "PharmaWatch · Batch expiry tracker",
    template: "%s · PharmaWatch",
  },
  description: DESCRIPTION,
  applicationName: "PharmaWatch",
  keywords: ["pharmacy", "batch expiry", "dead stock", "inventory", "Bangladesh"],
  openGraph: {
    type: "website",
    locale: "en_BD",
    url: SITE,
    siteName: "PharmaWatch",
    title: "PharmaWatch · Batch expiry tracker",
    description: "See which medicine will expire unsold, while there is still time to act.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0E3529" },
    { media: "(prefers-color-scheme: dark)", color: "#06170F" },
  ],
};
