import type { MetadataRoute } from "next";
import { comparisons, scenarios } from "@/lib/vehicles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carcomparisonai.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/methodology`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/choose`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.2 },
    ...comparisons.map((c) => ({
      url: `${siteUrl}/compare/${c.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...scenarios.map((s) => ({
      url: `${siteUrl}/best/${s.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
