import type { MetadataRoute } from "next";
import { DOC_SECTIONS } from "@/lib/docs-structure";

const BASE = "https://trinityailabs.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/docs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE}/terms`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const docPages: MetadataRoute.Sitemap = DOC_SECTIONS.flatMap((section) =>
    section.chapters.map((chapter) => ({
      url: `${BASE}/docs/${section.slug}/${chapter.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  );

  return [...staticPages, ...docPages];
}
