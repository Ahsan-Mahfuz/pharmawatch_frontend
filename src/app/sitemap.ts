import type { MetadataRoute } from "next";
import { SITE as site } from "@/lib/metadata";
import { NAV } from "@/lib/nav";

export default function sitemap(): MetadataRoute.Sitemap {
  return NAV.map((item) => ({
    url: new URL(item.href, site).href,
    changeFrequency: "daily" as const,
    priority: item.href === "/" ? 1 : 0.7,
  }));
}
