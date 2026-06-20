import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { computeReadingTime } from "./content";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: string;
  draft: boolean;
};

export type Post = PostMeta & {
  content: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function fileToPost(filename: string): Post {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const slug = (data.slug as string) || filename.replace(/\.mdx?$/, "");
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    summary: (data.summary as string) || "",
    tags: (data.tags as string[]) || [],
    readingTime: (data.readingTime as string) || computeReadingTime(content),
    draft: Boolean(data.draft),
    content,
  };
}

function listFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs.readdirSync(CONTENT_DIR).filter((f) => /\.mdx?$/.test(f));
}

export function getAllPosts(): PostMeta[] {
  return listFiles()
    .map(fileToPost)
    .filter((p) => !p.draft)
    .map((p) => {
      const { content, ...meta } = p;
      void content;
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | null {
  for (const f of listFiles()) {
    const p = fileToPost(f);
    if (p.slug === slug && !p.draft) return p;
  }
  return null;
}
