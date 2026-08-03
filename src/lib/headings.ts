import GithubSlugger from "github-slugger";
import type { Heading } from "@/app/components/TableOfContents";

/**
 * h2/h3 headings for the contents rail. Uses the same slugger rehype-slug
 * does, so the anchors it emits and the ids in the rendered body agree.
 */
export function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inCode = false;

  for (const line of content.split("\n")) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (m) {
      const text = m[2].trim().replace(/[*_`]/g, "");
      headings.push({ level: m[1].length, text, slug: slugger.slug(text) });
    }
  }
  return headings;
}
