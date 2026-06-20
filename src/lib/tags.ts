import "server-only";
import { getAllPosts, type PostMeta } from "./blog";
import { getAllWhitepapers, type WhitepaperMeta } from "./whitepapers";
import { tagSlug } from "./content";

export type TaggedItem =
  | { kind: "whitepaper"; item: WhitepaperMeta }
  | { kind: "post"; item: PostMeta };

export function getAllTagSlugs(): string[] {
  const set = new Set<string>();
  for (const p of getAllWhitepapers()) for (const t of p.tags) set.add(tagSlug(t));
  for (const p of getAllPosts()) for (const t of p.tags) set.add(tagSlug(t));
  return [...set];
}

export function getItemsForTag(slug: string): {
  display: string;
  items: TaggedItem[];
} {
  let display = slug;
  const items: TaggedItem[] = [];

  for (const item of getAllWhitepapers()) {
    for (const t of item.tags) {
      if (tagSlug(t) === slug) {
        display = t;
        items.push({ kind: "whitepaper", item });
        break;
      }
    }
  }
  for (const item of getAllPosts()) {
    for (const t of item.tags) {
      if (tagSlug(t) === slug) {
        display = t;
        items.push({ kind: "post", item });
        break;
      }
    }
  }

  items.sort((a, b) => (a.item.date < b.item.date ? 1 : -1));
  return { display, items };
}
