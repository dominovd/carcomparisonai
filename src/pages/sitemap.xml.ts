import type { APIRoute } from "astro";
import { comparisons, scenarios } from "@/lib/vehicles";

const site = "https://carcomparisonai.com";

export const GET: APIRoute = () => {
  const urls = [
    "",
    "/choose",
    "/methodology",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
    ...comparisons.map((c) => `/compare/${c.slug}`),
    ...scenarios.map((s) => `/best/${s.slug}`),
  ];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    urls.map((u) => `<url><loc>${site}${u}</loc></url>`).join("") +
    `</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
};
