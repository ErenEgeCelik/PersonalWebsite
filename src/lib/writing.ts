import "server-only";
import { getAllWhitepapers, getWhitepaper } from "./whitepapers";
import { getAllPosts, getPost } from "./blog";

export type WritingKind = "paper" | "note";

export type WritingMeta = {
  slug: string;
  title: string;
  subtitle?: string;
  /** ISO, for sorting and <time>. */
  date: string;
  /** "June 2026" — ISO dates read like log entries in a reading list. */
  displayDate: string;
  summary: string;
  tags: string[];
  readingTime: string;
  kind: WritingKind;
  /** Free-text status, papers only ("Working paper", "Reference note"). */
  status?: string;
};

function monthYear(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}

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
    displayDate: monthYear(p.date),
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
    displayDate: monthYear(p.date),
    summary: p.summary,
    tags: p.tags,
    readingTime: p.readingTime,
    kind: "note",
  }));
  // Papers before notes within the same month — a reading list should lead
  // with the substantial thing, not with whatever happens to be newest.
  const weight = (w: WritingMeta) => (w.kind === "paper" ? 1 : 0);
  return [...papers, ...notes].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return weight(b) - weight(a);
  });
}

export function getWriting(slug: string): Writing | null {
  const paper = getWhitepaper(slug);
  if (paper) {
    return {
      slug: paper.slug,
      title: paper.title,
      subtitle: paper.subtitle,
      date: paper.date,
      displayDate: monthYear(paper.date),
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
      displayDate: monthYear(post.date),
      summary: post.summary,
      tags: post.tags,
      readingTime: post.readingTime,
      kind: "note",
      content: post.content,
    };
  }
  return null;
}
