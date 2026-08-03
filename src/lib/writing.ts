import "server-only";
import { getAllWhitepapers, getWhitepaper } from "./whitepapers";
import { getAllPosts, getPost } from "./blog";

export type WritingKind = "paper" | "note";

export type WritingMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  date: string;
  summary: string;
  tags: string[];
  readingTime: string;
  kind: WritingKind;
  /** Free-text status, papers only ("Working paper", "Reference note"). */
  status?: string;
};

export type Writing = WritingMeta & { content: string };

/**
 * /writing is one chronological stream over both collections. Papers and
 * notes keep their own directories and frontmatter; they only merge here.
 */
export function getAllWriting(): WritingMeta[] {
  const papers: WritingMeta[] = getAllWhitepapers().map((p) => ({
    slug: p.slug,
    title: p.title,
    subtitle: p.subtitle,
    date: p.date,
    summary: p.summary,
    tags: p.tags,
    readingTime: p.readingTime,
    kind: "paper",
    status: p.status,
  }));
  const notes: WritingMeta[] = getAllPosts().map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    summary: p.summary,
    tags: p.tags,
    readingTime: p.readingTime,
    kind: "note",
  }));
  return [...papers, ...notes].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getWriting(slug: string): Writing | null {
  const paper = getWhitepaper(slug);
  if (paper) {
    return {
      slug: paper.slug,
      title: paper.title,
      subtitle: paper.subtitle,
      date: paper.date,
      summary: paper.summary,
      tags: paper.tags,
      readingTime: paper.readingTime,
      kind: "paper",
      status: paper.status,
      content: paper.content,
    };
  }
  const post = getPost(slug);
  if (post) {
    return {
      slug: post.slug,
      title: post.title,
      date: post.date,
      summary: post.summary,
      tags: post.tags,
      readingTime: post.readingTime,
      kind: "note",
      content: post.content,
    };
  }
  return null;
}
