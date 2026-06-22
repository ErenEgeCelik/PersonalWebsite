import { getAllPosts } from "@/lib/blog";
import { getAllWhitepapers } from "@/lib/whitepapers";

const SITE_URL = "https://erenege.com";
const SITE_TITLE = "Eren Ege Çelik";
const SITE_DESCRIPTION =
  "Whitepapers and notes on information theory, reversible computing, computational complexity, and market microstructure.";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type FeedItem = {
  title: string;
  link: string;
  guid: string;
  pubDate: string;
  description: string;
  category: string;
};

function isoToRfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

export async function GET() {
  const items: FeedItem[] = [];

  for (const p of getAllWhitepapers()) {
    items.push({
      title: p.title,
      link: `${SITE_URL}/whitepapers/${p.slug}`,
      guid: `${SITE_URL}/whitepapers/${p.slug}`,
      pubDate: isoToRfc822(p.date),
      description: p.summary,
      category: "Whitepaper",
    });
  }
  for (const p of getAllPosts()) {
    items.push({
      title: p.title,
      link: `${SITE_URL}/blog/${p.slug}`,
      guid: `${SITE_URL}/blog/${p.slug}`,
      pubDate: isoToRfc822(p.date),
      description: p.summary,
      category: "Blog",
    });
  }

  items.sort((a, b) => (new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()));

  const lastBuildDate = items[0]?.pubDate ?? new Date().toUTCString();

  const itemsXml = items
    .map(
      (it) => `    <item>
      <title>${escapeXml(it.title)}</title>
      <link>${it.link}</link>
      <guid isPermaLink="true">${it.guid}</guid>
      <pubDate>${it.pubDate}</pubDate>
      <category>${it.category}</category>
      <description>${escapeXml(it.description)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

export const dynamic = "force-static";
