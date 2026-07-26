import Link from "next/link";
import styles from "../page.module.css";
import subStyles from "../cv/cv.module.css";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description:
    "Short notes, methodology fragments, and lessons from research-in-progress.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <h1 className={subStyles.title}>Blog</h1>
        <p className={subStyles.subtitle}>
          Short notes, methodology fragments, and lessons from research-in-progress.
        </p>
      </header>

      {posts.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No posts yet.</p>
      ) : (
        <div className={styles.plainList}>
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className={styles.plainRow}>
              <div className={styles.plainRowMain}>
                <span className={styles.plainRowTitle}>{p.title}</span>
                {p.summary && <span className={styles.plainRowDesc}>{p.summary}</span>}
                {p.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                    {p.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className={styles.plainRowDate}>{p.date}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
