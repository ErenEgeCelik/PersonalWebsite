import Link from "next/link";
import styles from "../page.module.css";
import subStyles from "../cv/cv.module.css";
import { getAllWhitepapers } from "@/lib/whitepapers";
import { tagHref } from "@/lib/content";

export default function WhitepapersIndex() {
  const papers = getAllWhitepapers();

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <div className={subStyles.eyebrow}>Whitepapers</div>
        <h1 className={subStyles.title}>Working papers & notes</h1>
        <p className={subStyles.subtitle}>
          Empirical studies and theoretical drafts. Most are negative-result research; the methodology is the point.
        </p>
      </header>

      <section className={styles.section}>
        <div className={subStyles.list}>
          {papers.map((p) => (
            <article key={p.slug} className={subStyles.row}>
              <span className={subStyles.rowDate}>{p.date}</span>
              <div className={subStyles.rowBody}>
                <Link href={`/whitepapers/${p.slug}`} className={styles.entryTitle}>
                  {p.title}
                </Link>
                {p.subtitle && <div className={subStyles.rowMeta}>{p.subtitle}</div>}
                <p className={subStyles.rowDetail}>{p.summary}</p>
                <div className={subStyles.docs}>
                  {p.tags.map((tag) => (
                    <Link key={tag} href={tagHref(tag)} className={styles.tag}>{tag}</Link>
                  ))}
                </div>
              </div>
              <Link href={`/whitepapers/${p.slug}`} className={styles.entryAction}>
                read →
              </Link>
            </article>
          ))}
          {papers.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>No whitepapers yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
