import Link from "next/link";
import styles from "../page.module.css";
import subStyles from "../cv/cv.module.css";
import { getAllPosts } from "@/lib/blog";

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <div className={subStyles.eyebrow}>Blog</div>
        <h1 className={subStyles.title}>Notes from the desk</h1>
        <p className={subStyles.subtitle}>
          Short observations, methodology fragments, and lessons from research-in-progress. Smaller than whitepapers, more opinionated.
        </p>
      </header>

      <section className={styles.section}>
        <div className={subStyles.list}>
          {posts.map((p) => (
            <article key={p.slug} className={subStyles.row}>
              <span className={subStyles.rowDate}>{p.date}</span>
              <div className={subStyles.rowBody}>
                <Link href={`/blog/${p.slug}`} className={styles.entryTitle}>
                  {p.title}
                </Link>
                <p className={subStyles.rowDetail}>{p.summary}</p>
                <div className={subStyles.docs}>
                  {p.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                  {p.readingTime && <span className={styles.tag}>{p.readingTime}</span>}
                </div>
              </div>
              <Link href={`/blog/${p.slug}`} className={styles.entryAction}>
                read →
              </Link>
            </article>
          ))}
          {posts.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No posts yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
