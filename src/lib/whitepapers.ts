import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { computeReadingTime } from "./content";

export type WhitepaperMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  status: string;
  tags: string[];
  summary: string;
  readingTime: string;
  draft: boolean;
};

export type Whitepaper = WhitepaperMeta & {
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "whitepapers");

function fileToWhitepaper(filename: string): Whitepaper {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const slug = (data.slug as string) || filename.replace(/\.mdx?$/, "");
  return {
    slug,
    title: data.title as string,
    subtitle: data.subtitle as string | undefined,
    date: data.date as string,
    status: (data.status as string) || "Draft",
    tags: (data.tags as string[]) || [],
    summary: (data.summary as string) || "",
    readingTime: (data.readingTime as string) || computeReadingTime(content),
    draft: Boolean(data.draft),
    content,
  };
}

function listFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter((f) => /\.mdx?$/.test(f));
}

export function getAllWhitepapers(): WhitepaperMeta[] {
  return listFiles()
    .map(fileToWhitepaper)
    .filter((p) => !p.draft)
    .map((p) => {
      const { content, ...meta } = p;
      void content;
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getWhitepaper(slug: string): Whitepaper | null {
  for (const f of listFiles()) {
    const p = fileToWhitepaper(f);
    if (p.slug === slug && !p.draft) return p;
  }
  return null;
}
