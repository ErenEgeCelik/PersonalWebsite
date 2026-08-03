import Link from "next/link";
import styles from "./page.module.css";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className={`${styles.column} ${styles.page}`}>
      <div className={styles.prose620}>
        <p className={styles.kicker}>404</p>
        <h1 className={styles.h1Page}>This page doesn&apos;t exist</h1>
        <p className={styles.intro}>
          The link may be stale, or the page was renamed. The work and the writing are both one
          click away.
        </p>
        <div className={styles.btnRow}>
          <Link href="/work" className={`${styles.btn} ${styles.btnPrimary}`}>
            Work
          </Link>
          <Link href="/writing" className={`${styles.btn} ${styles.btnSecondary}`}>
            Writing
          </Link>
          <Link href="/" className={`${styles.btn} ${styles.btnSecondary}`}>
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
