import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { computeReadingTime } from "./content";

/** Long-form markdown entry — shared by whitepapers and case studies. */
export type DocMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  status: string;
  tags: string[];
  summary: string;
  readingTime: string;
  draft: boolean;
  /** Case studies only: the period the work covers, e.g. "April – July 2026". */
  period?: string;
  /** Case studies only: venue / instrument the work is about. */
  venue?: string;
};

export type Doc = DocMeta & { content: string };

function parse(dir: string, filename: string, defaultStatus: string): Doc {
  const raw = fs.readFileSync(path.join(dir, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: (data.slug as string) || filename.replace(/\.mdx?$/, ""),
    title: data.title as string,
    subtitle: data.subtitle as string | undefined,
    date: data.date as string,
    status: (data.status as string) || defaultStatus,
    tags: (data.tags as string[]) || [],
    summary: (data.summary as string) || "",
    readingTime: (data.readingTime as string) || computeReadingTime(content),
    draft: Boolean(data.draft),
    period: data.period as string | undefined,
    venue: data.venue as string | undefined,
    content,
  };
}

function listFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f));
}

/** A markdown collection under content/<name>/. */
export function collection(name: string, defaultStatus: string) {
  const dir = path.join(process.cwd(), "content", name);

  function all(): DocMeta[] {
    return listFiles(dir)
      .map((f) => parse(dir, f, defaultStatus))
      .filter((d) => !d.draft)
      .map(({ content, ...meta }) => {
        void content;
        return meta;
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  function one(slug: string): Doc | null {
    for (const f of listFiles(dir)) {
      const d = parse(dir, f, defaultStatus);
      if (d.slug === slug && !d.draft) return d;
    }
    return null;
  }

  return { all, one };
}
