import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";
import styles from "../../page.module.css";
import subStyles from "../../cv/cv.module.css";
import paperStyles from "../../whitepapers/[slug]/paper.module.css";
import blogStyles from "./post.module.css";
import { getAllPosts, getPost } from "@/lib/blog";
import { tagHref } from "@/lib/content";
import TableOfContents, { type Heading } from "../../whitepapers/[slug]/TableOfContents";
import PrintButton from "../../whitepapers/[slug]/PrintButton";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

function extractHeadings(content: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inCode = false;
  for (const line of content.split("\n")) {
    if (line.trim().startsWith("```")) { inCode = !inCode; continue; }
    if (inCode) continue;
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

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const all = getAllPosts();
  const idx = all.findIndex((p) => p.slug === slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;

  const headings = extractHeadings(post.content);

  return (
    <main className={paperStyles.layout}>
      <div className={paperStyles.content}>
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
            <span className={paperStyles.crumbSpacer} />
            <PrintButton />
          </div>
          <h1 className={paperStyles.title}>{post.title}</h1>
          {post.summary && <p className={paperStyles.summary}>{post.summary}</p>}
          {post.tags.length > 0 && (
            <div className={paperStyles.tags}>
              {post.tags.map((tag) => (
                <Link key={tag} href={tagHref(tag)} className={styles.tag}>{tag}</Link>
              ))}
            </div>
          )}
        </header>

        <article className={paperStyles.body}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSlug]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {(newer || older) && (
          <nav className={blogStyles.postNav} aria-label="Post navigation">
            <div className={blogStyles.postNavCol}>
              {older && (
                <Link href={`/blog/${older.slug}`} className={blogStyles.postNavLink}>
                  <span className={blogStyles.postNavLabel}>Older</span>
                  <span className={blogStyles.postNavTitle}>{older.title}</span>
                </Link>
              )}
            </div>
            <div className={`${blogStyles.postNavCol} ${blogStyles.postNavColRight}`}>
              {newer && (
                <Link href={`/blog/${newer.slug}`} className={blogStyles.postNavLink}>
                  <span className={blogStyles.postNavLabel}>Newer</span>
                  <span className={blogStyles.postNavTitle}>{newer.title}</span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>

      <aside className={paperStyles.sidebar}>
        <TableOfContents headings={headings} />
      </aside>
    </main>
  );
}
