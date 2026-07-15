import Link from "next/link";
import styles from "../page.module.css";
import subStyles from "../cv/cv.module.css";
import { getAllWhitepapers } from "@/lib/whitepapers";

export default function WhitepapersIndex() {
  const papers = getAllWhitepapers();

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <h1 className={subStyles.title}>Whitepapers</h1>
        <p className={subStyles.subtitle}>
          Empirical studies and theoretical drafts. Most are negative-result research; the methodology is the point.
        </p>
      </header>

      {papers.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No whitepapers yet.</p>
      ) : (
        <div className={styles.plainList}>
          {papers.map((p) => (
            <Link key={p.slug} href={`/whitepapers/${p.slug}`} className={styles.plainRow}>
              <div className={styles.plainRowMain}>
                <span className={styles.plainRowTitle}>
                  {p.title}
                  <span className={styles.plainRowBadge}>{p.status.toLowerCase()}</span>
                </span>
                {p.subtitle && (
                  <span className={styles.plainRowDesc} style={{ fontStyle: "italic" }}>{p.subtitle}</span>
                )}
                {p.summary && <span className={styles.plainRowDesc}>{p.summary}</span>}
                {p.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                    {p.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <span className={styles.plainRowDate}>
                {p.date}
                {p.readingTime && (
                  <>
                    <br />
                    <span style={{ color: "var(--text-muted)", fontSize: 12 }}>{p.readingTime}</span>
                  </>
                )}
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
