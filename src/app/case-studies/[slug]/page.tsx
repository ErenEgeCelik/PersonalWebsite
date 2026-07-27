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
import paperStyles from "../../whitepapers/[slug]/paper.module.css";
import { getAllCaseStudies, getCaseStudy } from "@/lib/case-studies";
import { tagHref } from "@/lib/content";
import TableOfContents, { type Heading } from "../../whitepapers/[slug]/TableOfContents";
import PrintButton from "../../whitepapers/[slug]/PrintButton";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return { title: "Not found" };
  const description = study.summary || study.subtitle;
  return {
    title: study.title,
    description,
    alternates: { canonical: `/case-studies/${study.slug}` },
    openGraph: {
      title: study.title,
      description,
      type: "article",
      publishedTime: study.date,
      url: `/case-studies/${study.slug}`,
    },
  };
}

export function generateStaticParams() {
  return getAllCaseStudies().map((c) => ({ slug: c.slug }));
}

function extractHeadings(content: string): Heading[] {
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
      const level = m[1].length;
      const text = m[2].trim().replace(/[*_`]/g, "");
      headings.push({ level, text, slug: slugger.slug(text) });
    }
  }
  return headings;
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const headings = extractHeadings(study.content);

  return (
    <main className={paperStyles.layout}>
      <div className={paperStyles.content}>
        <header className={subStyles.header}>
          <div className={paperStyles.crumbs}>
            <Link href="/case-studies" className={paperStyles.crumb}>
              ← Case studies
            </Link>
            <span className={paperStyles.crumbSep}>·</span>
            <span className={paperStyles.crumbDate}>{study.period ?? study.date}</span>
            {study.readingTime && (
              <>
                <span className={paperStyles.crumbSep}>·</span>
                <span className={paperStyles.crumbDate}>{study.readingTime}</span>
              </>
            )}
            <span className={paperStyles.crumbSpacer} />
            <PrintButton />
          </div>

          <h1 className={paperStyles.title}>{study.title}</h1>
          {study.subtitle && <p className={paperStyles.subtitle}>{study.subtitle}</p>}
          {study.venue && <p className={paperStyles.venue}>{study.venue}</p>}
          {study.summary && <p className={paperStyles.summary}>{study.summary}</p>}

          <div className={paperStyles.tags}>
            {study.tags.map((tag) => (
              <Link key={tag} href={tagHref(tag)} className={styles.tag}>
                {tag}
              </Link>
            ))}
          </div>
        </header>

        <article className={paperStyles.body}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: false }]]}
            rehypePlugins={[rehypeSlug, rehypeKatex]}
          >
            {study.content}
          </ReactMarkdown>
        </article>
      </div>

      <aside className={paperStyles.sidebar}>
        <TableOfContents headings={headings} />
      </aside>
    </main>
  );
}
