import Link from "next/link";
import styles from "../page.module.css";
import subStyles from "../cv/cv.module.css";
import { getAllWhitepapers } from "@/lib/whitepapers";

export default function WhitepapersIndex() {
  const papers = getAllWhitepapers();
  const [featured, ...rest] = papers;

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <div className={subStyles.eyebrow}>Whitepapers</div>
        <h1 className={subStyles.title}>Working papers & notes</h1>
        <p className={subStyles.subtitle}>
          Empirical studies and theoretical drafts. Most are negative-result research; the methodology is the point.
        </p>
      </header>

      {featured && (
        <section className={styles.section} style={{ marginBottom: 24 }}>
          <Link href={`/whitepapers/${featured.slug}`} className={styles.featured}>
            <div className={styles.featuredEyebrow}>
              <span className={styles.kind}>Featured · {featured.status}</span>
              <span className={styles.sep}>·</span>
              <span>{featured.date}</span>
              <span className={styles.sep}>·</span>
              <span>{featured.readingTime}</span>
            </div>
            <h2 className={styles.featuredTitle}>{featured.title}</h2>
            {featured.subtitle && <p className={styles.featuredSubtitle}>{featured.subtitle}</p>}
            <p className={styles.featuredSummary}>{featured.summary}</p>
            <div className={styles.featuredFoot}>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {featured.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <span className={styles.featuredAction}>Read full →</span>
            </div>
          </Link>
        </section>
      )}

      {rest.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>More</h2>
          </div>
          <div className={styles.cardGrid}>
            {rest.map((p) => (
              <Link key={p.slug} href={`/whitepapers/${p.slug}`} className={styles.contentCard}>
                <div className={styles.cardEyebrow}>
                  <span className={styles.kind}>{p.status}</span>
                  <span className={styles.sep}>·</span>
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

      {papers.length === 0 && (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No whitepapers yet.</p>
      )}
    </main>
  );
}
