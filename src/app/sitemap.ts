import type { MetadataRoute } from "next";
import { PAINTINGS } from "@/data/paintings";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/discover", "/gallery", "/about", "/ateliers", "/studio", "/styles", "/contact", "/privacy", "/terms"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })
  );

  const art = PAINTINGS.map((p) => ({
    url: `${siteUrl}/art/${p.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...routes, ...art];
}
