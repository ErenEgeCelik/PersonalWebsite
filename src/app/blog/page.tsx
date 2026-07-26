import Link from "next/link";
import styles from "../page.module.css";
import subStyles from "../cv/cv.module.css";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Short notes, methodology fragments, and lessons from research-in-progress.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <p className={subStyles.eyebrow}>Blog</p>
        <h1 className={subStyles.title}>Notes in the margin</h1>
        <p className={subStyles.subtitle}>
          Shorter than a paper and more opinionated: method fragments, things that went wrong, and
          the reasoning behind decisions that the papers only state as conclusions.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className={subStyles.rowDetail}>No posts yet.</p>
      ) : (
        <div className={styles.plainList}>
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className={styles.plainRow}>
              <div className={styles.plainRowMain}>
                <span className={styles.plainRowTitle}>{p.title}</span>
                {p.summary && <span className={styles.plainRowDesc}>{p.summary}</span>}
                {p.tags.length > 0 && (
                  <div className={styles.tags}>
                    {p.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className={styles.plainRowDate}>
                {p.date}
                <br />
                {p.readingTime}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
