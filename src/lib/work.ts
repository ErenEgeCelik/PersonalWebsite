import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { computeReadingTime } from "./content";

export type ProjectMeta = {
  slug: string;
  title: string;
  /** Index order — the design specifies an explicit sequence, not date order. */
  order: number;
  kicker: string;
  year: string;
  period: string;
  role: string;
  stack: string;
  venue?: string;
  /** Compressed one-liner used on the home page. */
  short: string;
  /** Longer line used on the Work index and the detail header. */
  summary: string;
  tags: string[];
  readingTime: string;
  /** Optional link to the paper this project is written up in. */
  paper?: string;
  /** Optional public companion repo. */
  repo?: string;
  /** Render the account-value chart from content/equity.json on this page. */
  equityChart: boolean;
  draft: boolean;
};

export type Project = ProjectMeta & { content: string };

const DIR = path.join(process.cwd(), "content", "work");

function parse(filename: string): Project {
  const raw = fs.readFileSync(path.join(DIR, filename), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: (data.slug as string) || filename.replace(/\.mdx?$/, ""),
    title: data.title as string,
    order: Number(data.order ?? 99),
    kicker: (data.kicker as string) || "",
    year: (data.year as string) || "",
    period: (data.period as string) || (data.year as string) || "",
    role: (data.role as string) || "",
    stack: (data.stack as string) || "",
    venue: data.venue as string | undefined,
    short: (data.short as string) || (data.summary as string) || "",
    summary: (data.summary as string) || "",
    tags: (data.tags as string[]) || [],
    readingTime: (data.readingTime as string) || computeReadingTime(content),
    paper: data.paper as string | undefined,
    repo: data.repo as string | undefined,
    equityChart: Boolean(data.equityChart),
    draft: Boolean(data.draft),
    content,
  };
}

function listFiles(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR).filter((f) => /\.mdx?$/.test(f));
}

export function getAllProjects(): ProjectMeta[] {
  return listFiles()
    .map(parse)
    .filter((p) => !p.draft)
    .map(({ content, ...meta }) => {
      void content;
      return meta;
    })
    .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | null {
  for (const f of listFiles()) {
    const p = parse(f);
    if (p.slug === slug && !p.draft) return p;
  }
  return null;
}
