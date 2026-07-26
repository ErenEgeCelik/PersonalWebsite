import Link from "next/link";
import styles from "../page.module.css";
import subStyles from "../cv/cv.module.css";
import { getAllWhitepapers } from "@/lib/whitepapers";

export const metadata = {
  title: "Whitepapers",
  description:
    "Empirical studies and theoretical drafts on prediction-market microstructure and market making. Most are negative-result research; the methodology is the point.",
  alternates: { canonical: "/whitepapers" },
};

export default function WhitepapersIndex() {
  const papers = getAllWhitepapers();

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <p className={subStyles.eyebrow}>Whitepapers</p>
        <h1 className={subStyles.title}>Studies and working drafts</h1>
        <p className={subStyles.subtitle}>
          Empirical work on prediction-market microstructure and market making. Most of it is
          negative-result research — the methodology is the point, and the failures are reported as
          carefully as anything that worked.
        </p>
      </header>

      {papers.length === 0 ? (
        <p className={subStyles.rowDetail}>No whitepapers yet.</p>
      ) : (
        <div className={styles.plainList}>
          {papers.map((p) => (
            <Link key={p.slug} href={`/whitepapers/${p.slug}`} className={styles.plainRow}>
              <div className={styles.plainRowMain}>
                <span className={styles.plainRowTitle}>
                  {p.title}
                  <span className={styles.plainRowBadge}>{p.status}</span>
                </span>
                {p.subtitle && (
                  <span className={styles.plainRowDesc}>
                    <em>{p.subtitle}</em>
                  </span>
                )}
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
