import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? "https://carcomparisonai.com",
  integrations: [react(), tailwind({ applyBaseStyles: false })],
  adapter: vercel({ webAnalytics: { enabled: true } }),
});
