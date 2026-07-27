import Link from "next/link";
import styles from "../page.module.css";
import subStyles from "../cv/cv.module.css";
import { getAllCaseStudies } from "@/lib/case-studies";

export const metadata = {
  title: "Case studies",
  description:
    "End-to-end write-ups of systematic trading projects on Polymarket — what the edge was, what it was worth, how it was measured, and how it ended.",
  alternates: { canonical: "/case-studies" },
};

export default function CaseStudiesIndex() {
  const studies = getAllCaseStudies();

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <p className={subStyles.eyebrow}>Case studies</p>
        <h1 className={subStyles.title}>Projects, start to finish</h1>
        <p className={subStyles.subtitle}>
          Systematic trading projects built and run solo on Polymarket — data collection, modelling,
          execution, risk and post-mortem. Each one says what the edge was, what it was worth, how it
          was measured, and how it ended. One of them was retired because the measurement said so.
        </p>
      </header>

      {studies.length === 0 ? (
        <p className={subStyles.rowDetail}>No case studies yet.</p>
      ) : (
        <div className={styles.plainList}>
          {studies.map((c) => (
            <Link key={c.slug} href={`/case-studies/${c.slug}`} className={styles.plainRow}>
              <div className={styles.plainRowMain}>
                <span className={styles.plainRowTitle}>
                  {c.title}
                  {c.period && <span className={styles.plainRowBadge}>{c.period}</span>}
                </span>
                {c.subtitle && (
                  <span className={styles.plainRowDesc}>
                    <em>{c.subtitle}</em>
                  </span>
                )}
                {c.summary && <span className={styles.plainRowDesc}>{c.summary}</span>}
                {c.tags.length > 0 && (
                  <div className={styles.tags}>
                    {c.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className={styles.plainRowDate}>{c.readingTime}</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
