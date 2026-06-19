import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../../page.module.css";
import subStyles from "../../cv/cv.module.css";
import paperStyles from "./paper.module.css";
import { getAllWhitepapers, getWhitepaper } from "@/lib/whitepapers";

export function generateStaticParams() {
  return getAllWhitepapers().map((p) => ({ slug: p.slug }));
}

export default async function WhitepaperPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = getWhitepaper(slug);
  if (!paper) notFound();

  return (
    <main className={styles.main}>
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
        </div>
        <h1 className={paperStyles.title}>{paper.title}</h1>
        {paper.subtitle && <p className={paperStyles.subtitle}>{paper.subtitle}</p>}
        {paper.summary && <p className={paperStyles.summary}>{paper.summary}</p>}
        <div className={paperStyles.tags}>
          {paper.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </header>

      <article className={paperStyles.body}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{paper.content}</ReactMarkdown>
      </article>
    </main>
  );
}
