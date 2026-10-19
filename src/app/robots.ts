import type { MetadataRoute } from "next";

import { SITE as site } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", site).href,
  };
}
