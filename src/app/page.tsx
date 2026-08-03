import Link from "next/link";
import styles from "./page.module.css";
import { getHomeCopy } from "@/lib/home";
import { getAllProjects } from "@/lib/work";
import { getAllWriting } from "@/lib/writing";
import { SITE_EMAIL } from "@/lib/site";

export default function Home() {
  const copy = getHomeCopy();
  const featured = getAllProjects().slice(0, 3);
  const recent = getAllWriting().slice(0, 3);

  return (
    <main className={styles.column}>
      <section className={`${styles.hero} ${styles.enter} ${styles.prose660}`}>
        {copy.kicker && <p className={styles.kicker}>{copy.kicker}</p>}
        <h1 className={styles.h1Home}>{copy.name}</h1>
        <p className={styles.lead}>{copy.lead}</p>
        {copy.availability && <p className={styles.availability}>{copy.availability}</p>}

        <div className={styles.btnRow}>
          <Link href="/work" className={`${styles.btn} ${styles.btnPrimary}`}>
            See the work
          </Link>
          <Link href="/writing" className={`${styles.btn} ${styles.btnSecondary}`}>
            Read the papers
          </Link>
          <a href={`mailto:${SITE_EMAIL}`} className={`${styles.btn} ${styles.btnSecondary}`}>
            Email
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.sectionLabel}>Selected work</p>
          <Link href="/work" className={styles.moreLink}>
            All work →
          </Link>
        </div>
        <div className={styles.list}>
          {featured.map((p) => (
            <Link key={p.slug} href={`/work/${p.slug}`} className={`${styles.row} ${styles.rowTight}`}>
              <h2 className={`${styles.rowTitle} ${styles.rowTitleSm}`}>{p.title}</h2>
              <span className={styles.rowMeta}>{p.year}</span>
              <p className={`${styles.rowSummary} ${styles.rowSummarySm}`}>{p.short}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.sectionLabel}>Writing</p>
          <Link href="/writing" className={styles.moreLink}>
            All posts →
          </Link>
        </div>
        <div className={styles.list}>
          {recent.map((w) => (
            <Link
              key={w.slug}
              href={`/writing/${w.slug}`}
              className={`${styles.row} ${styles.rowTight}`}
            >
              <h2 className={`${styles.rowTitle} ${styles.rowTitleSm}`}>{w.title}</h2>
              <span className={styles.rowMeta}>
                {w.displayDate} · {w.readingTime}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
