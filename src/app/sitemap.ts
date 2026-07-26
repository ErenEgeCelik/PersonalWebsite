import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { getAllWhitepapers } from "@/lib/whitepapers";
import { getAllTagSlugs } from "@/lib/tags";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const papers = getAllWhitepapers();

  const newest = [...posts, ...papers]
    .map((p) => p.date)
    .sort()
    .at(-1);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: newest, priority: 1 },
    { url: `${SITE_URL}/whitepapers`, lastModified: newest, priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: newest, priority: 0.9 },
    { url: `${SITE_URL}/cv`, priority: 0.7 },
  ];

  const paperRoutes: MetadataRoute.Sitemap = papers.map((p) => ({
    url: `${SITE_URL}/whitepapers/${p.slug}`,
    lastModified: p.date,
    priority: 0.8,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: p.date,
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = getAllTagSlugs().map((slug) => ({
    url: `${SITE_URL}/tag/${slug}`,
    priority: 0.3,
  }));

  return [...staticRoutes, ...paperRoutes, ...postRoutes, ...tagRoutes];
}
