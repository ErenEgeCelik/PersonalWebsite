import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/work";
import { getAllWriting } from "@/lib/writing";
import { getAllTagSlugs } from "@/lib/tags";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const projects = getAllProjects();
  const writing = getAllWriting();
  const newest = writing.map((w) => w.date).sort().at(-1);

  return [
    { url: `${SITE_URL}/`, lastModified: newest, priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: newest, priority: 0.9 },
    { url: `${SITE_URL}/writing`, lastModified: newest, priority: 0.9 },
    { url: `${SITE_URL}/about`, priority: 0.8 },
    { url: `${SITE_URL}/now`, priority: 0.6 },
    { url: `${SITE_URL}/contact`, priority: 0.7 },
    { url: `${SITE_URL}/cv`, priority: 0.7 },
    ...projects.map((p) => ({
      url: `${SITE_URL}/work/${p.slug}`,
      priority: 0.9,
    })),
    ...writing.map((w) => ({
      url: `${SITE_URL}/writing/${w.slug}`,
      lastModified: w.date,
      priority: 0.8,
    })),
    ...getAllTagSlugs().map((slug) => ({
      url: `${SITE_URL}/tag/${slug}`,
      priority: 0.3,
    })),
  ];
}
