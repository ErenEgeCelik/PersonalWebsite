import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../../page.module.css";
import subStyles from "../../cv/cv.module.css";
import paperStyles from "../../whitepapers/[slug]/paper.module.css";
import { getAllPosts, getPost } from "@/lib/blog";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <div className={paperStyles.crumbs}>
          <Link href="/blog" className={paperStyles.crumb}>← Blog</Link>
          <span className={paperStyles.crumbSep}>·</span>
          <span className={paperStyles.crumbDate}>{post.date}</span>
          {post.readingTime && (
            <>
              <span className={paperStyles.crumbSep}>·</span>
              <span className={paperStyles.crumbDate}>{post.readingTime}</span>
            </>
          )}
        </div>
        <h1 className={paperStyles.title}>{post.title}</h1>
        {post.summary && <p className={paperStyles.summary}>{post.summary}</p>}
        <div className={paperStyles.tags}>
          {post.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </header>

      <article className={paperStyles.body}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
    </main>
  );
}
