import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import styles from "../../page.module.css";
import a from "../../article.module.css";
import { getAllWriting, getWriting } from "@/lib/writing";
import { tagHref } from "@/lib/content";
import { extractHeadings } from "@/lib/headings";
import TableOfContents from "../../components/TableOfContents";
import PrintButton from "../../components/PrintButton";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const w = getWriting(slug);
  if (!w) return { title: "Not found" };
  const description = w.summary || w.subtitle;
  return {
    title: w.title,
    description,
    alternates: { canonical: `/writing/${w.slug}` },
    openGraph: {
      title: w.title,
      description,
      type: "article",
      publishedTime: w.date,
      url: `/writing/${w.slug}`,
    },
  };
}

export function generateStaticParams() {
  return getAllWriting().map((w) => ({ slug: w.slug }));
}

export default async function WritingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getWriting(slug);
  if (!item) notFound();

  const all = getAllWriting();
  const idx = all.findIndex((w) => w.slug === slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const headings = extractHeadings(item.content);
  const long = headings.length > 5;

  return (
    <main className={`${a.layout} ${long ? "" : a.layoutPlain}`}>
      <article className={`${a.article} ${a.narrow}`}>
        <Link href="/writing" className={a.back}>
          ← Writing
        </Link>

        <h1 className={a.titlePost}>{item.title}</h1>
        {item.subtitle && <p className={a.summary}>{item.subtitle}</p>}

        <div className={a.postMeta}>
          <span>{item.date}</span>
          <span className={a.metaSep}>·</span>
          <span>{item.readingTime}</span>
          <span className={a.metaSep}>·</span>
          <span>{item.kind === "paper" ? item.status ?? "Paper" : "Note"}</span>
          <span className={a.spacer} />
          <PrintButton />
        </div>

        <div className={a.body}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm, [remarkMath, { singleDollarTextMath: false }]]}
            rehypePlugins={[rehypeSlug, rehypeKatex]}
          >
            {item.content}
          </ReactMarkdown>
        </div>

        {item.tags.length > 0 && (
          <div className={a.tagRow}>
            {item.tags.map((t) => (
              <Link key={t} href={tagHref(t)} className={styles.tag}>
                {t}
              </Link>
            ))}
          </div>
        )}

        <div className={a.articleFoot}>
          <Link href="/writing" className={`${styles.btn} ${styles.btnSecondary}`}>
            ← All writing
          </Link>
          {older && (
            <Link href={`/writing/${older.slug}`} className={`${styles.btn} ${styles.btnSecondary}`}>
              Older: {older.title}
            </Link>
          )}
          {newer && (
            <Link href={`/writing/${newer.slug}`} className={`${styles.btn} ${styles.btnSecondary}`}>
              Newer: {newer.title}
            </Link>
          )}
        </div>
      </article>

      {long && <TableOfContents headings={headings} />}
    </main>
  );
}
