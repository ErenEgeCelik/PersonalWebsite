import Link from "next/link";
import styles from "../page.module.css";
import { getAllWriting } from "@/lib/writing";

export const metadata = {
  title: "Writing",
  description:
    "Notes on microstructure, modelling, and the parts of research that don't make the highlight reel.",
  alternates: { canonical: "/writing" },
};

export default function WritingIndex() {
  const items = getAllWriting();

  return (
    <main className={`${styles.column} ${styles.page}`}>
      <h1 className={styles.h1Page}>Writing</h1>
      <p className={styles.intro}>
        Notes on microstructure, modelling, and the parts of research that don&apos;t make the
        highlight reel. Papers carry the full derivations; notes are shorter and more opinionated.
      </p>

      {items.length === 0 ? (
        <p className={`${styles.intro} ${styles.section}`}>Nothing published yet.</p>
      ) : (
        <div className={`${styles.list} ${styles.section}`}>
          {items.map((w) => (
            <Link key={w.slug} href={`/writing/${w.slug}`} className={styles.row}>
              <h2 className={`${styles.rowTitle} ${styles.rowTitlePost}`}>{w.title}</h2>
              <span className={styles.rowMeta}>
                {w.displayDate} · {w.readingTime}
              </span>
              <p className={`${styles.rowSummary} ${styles.rowSummarySm}`}>{w.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
