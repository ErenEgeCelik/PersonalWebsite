import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import GithubSlugger from "github-slugger";
import styles from "../../page.module.css";
import subStyles from "../../cv/cv.module.css";
import paperStyles from "./paper.module.css";
import { getAllWhitepapers, getWhitepaper } from "@/lib/whitepapers";
import { tagHref } from "@/lib/content";
import TableOfContents, { type Heading } from "./TableOfContents";
import PrintButton from "./PrintButton";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = getWhitepaper(slug);
  if (!paper) return { title: "Not found" };
  const description = paper.summary || paper.subtitle;
  return {
    title: paper.title,
    description,
    alternates: { canonical: `/whitepapers/${paper.slug}` },
    openGraph: {
      title: paper.title,
      description,
      type: "article",
      publishedTime: paper.date,
      url: `/whitepapers/${paper.slug}`,
    },
  };
}

export function generateStaticParams() {
  return getAllWhitepapers().map((p) => ({ slug: p.slug }));
}

function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const inCodeBlock = { current: false };
  for (const line of content.split("\n")) {
    if (line.trim().startsWith("```")) {
      inCodeBlock.current = !inCodeBlock.current;
      continue;
    }
    if (inCodeBlock.current) continue;
    const m = line.match(/^(#{2,3})\s+(.+)$/);
    if (m) {
      const level = m[1].length;
      const text = m[2].trim().replace(/[*_`]/g, "");
      const slug = slugger.slug(text);
      headings.push({ level, text, slug });
    }
  }
  return headings;
}

export default async function WhitepaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = getWhitepaper(slug);
  if (!paper) notFound();

  const headings = extractHeadings(paper.content);

  return (
    <main className={paperStyles.layout}>
      <div className={paperStyles.content}>
        <header className={subStyles.header}>
          <div className={paperStyles.crumbs}>
            <Link href="/whitepapers" className={paperStyles.crumb}>← Whitepapers</Link>
            <span className={paperStyles.crumbSep}>·</span>
            <span className={paperStyles.crumbDate}>{paper.date}</span>
            <span className={paperStyles.crumbSep}>·</span>
            <span className={paperStyles.crumbStatus}>{paper.status}</span>
            {paper.readingTime && (
              <>
                <span className={paperStyles.crumbSep}>·</span>
                <span className={paperStyles.crumbDate}>{paper.readingTime}</span>
              </>
            )}
            <span className={paperStyles.crumbSpacer} />
            <PrintButton />
          </div>
          <h1 className={paperStyles.title}>{paper.title}</h1>
          {paper.subtitle && <p className={paperStyles.subtitle}>{paper.subtitle}</p>}
          {paper.summary && <p className={paperStyles.summary}>{paper.summary}</p>}
          <div className={paperStyles.tags}>
            {paper.tags.map((tag) => (
              <Link key={tag} href={tagHref(tag)} className={styles.tag}>{tag}</Link>
            ))}
          </div>
        </header>

        <article className={paperStyles.body}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: false }]]}
            rehypePlugins={[rehypeSlug, rehypeKatex]}
          >
            {paper.content}
          </ReactMarkdown>
        </article>
      </div>

      <aside className={paperStyles.sidebar}>
        <TableOfContents headings={headings} />
      </aside>
    </main>
  );
}
