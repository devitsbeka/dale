import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/landing",
    "/jobs",
    "/salary",
    "/skills",
    "/paths",
    "/indices",
    "/career-map",
    "/relocation",
    "/immigration",
    "/companies",
  ];

  return routes.map((route) => ({
    url: `${APP_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
