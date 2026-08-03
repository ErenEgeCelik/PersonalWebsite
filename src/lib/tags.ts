import "server-only";
import { getAllWriting } from "./writing";
import { getAllProjects } from "./work";
import { tagSlug } from "./content";

export type TaggedItem = {
  href: string;
  title: string;
  summary: string;
  /** Right-hand column: a year for projects, a date for writing. */
  meta: string;
};

type Source = { tags: string[]; item: TaggedItem };

function sources(): Source[] {
  const projects: Source[] = getAllProjects().map((p) => ({
    tags: p.tags,
    item: {
      href: `/work/${p.slug}`,
      title: p.title,
      summary: p.summary,
      meta: p.year,
    },
  }));
  const writing: Source[] = getAllWriting().map((w) => ({
    tags: w.tags,
    item: {
      href: `/writing/${w.slug}`,
      title: w.title,
      summary: w.summary,
      meta: w.displayDate,
    },
  }));
  return [...projects, ...writing];
}

export function getAllTagSlugs(): string[] {
  const set = new Set<string>();
  for (const s of sources()) for (const t of s.tags) set.add(tagSlug(t));
  return [...set];
}

export function getItemsForTag(slug: string): { display: string; items: TaggedItem[] } {
  let display = slug;
  const items: TaggedItem[] = [];

  for (const s of sources()) {
    for (const t of s.tags) {
      if (tagSlug(t) === slug) {
        display = t;
        items.push(s.item);
        break;
      }
    }
  }

  return { display, items };
}
