import Link from "next/link";
import styles from "../page.module.css";
import subStyles from "../cv/cv.module.css";
import { getAllPosts } from "@/lib/blog";

export default function BlogIndex() {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <div className={subStyles.eyebrow}>Blog</div>
        <h1 className={subStyles.title}>Notes from the desk</h1>
        <p className={subStyles.subtitle}>
          Short observations, methodology fragments, and lessons from research-in-progress. Smaller than whitepapers, more opinionated.
        </p>
      </header>

      {featured && (
        <section className={styles.section} style={{ marginBottom: 24 }}>
          <Link href={`/blog/${featured.slug}`} className={styles.featured}>
            <div className={styles.featuredEyebrow}>
              <span className={styles.kind}>Latest post</span>
              <span className={styles.sep}>·</span>
              <span>{featured.date}</span>
              <span className={styles.sep}>·</span>
              <span>{featured.readingTime}</span>
            </div>
            <h2 className={styles.featuredTitle}>{featured.title}</h2>
            <p className={styles.featuredSummary}>{featured.summary}</p>
            <div className={styles.featuredFoot}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {featured.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <span className={styles.featuredAction}>Read →</span>
            </div>
          </Link>
        </section>
      )}

      {rest.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>More posts</h2>
          </div>
          <div className={styles.cardGrid}>
            {rest.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className={styles.contentCard}>
                <div className={styles.cardEyebrow}>
                  <span>{p.date}</span>
                  <span className={styles.sep}>·</span>
                  <span>{p.readingTime}</span>
                </div>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardSummary}>{p.summary}</p>
                <div className={styles.cardFoot}>
                  {p.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {posts.length === 0 && (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No posts yet.</p>
      )}
    </main>
  );
}
