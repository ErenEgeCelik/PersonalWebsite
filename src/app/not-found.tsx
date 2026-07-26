import Link from "next/link";
import styles from "./page.module.css";
import subStyles from "./cv/cv.module.css";

export const metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <div className={subStyles.eyebrow}>404</div>
        <h1 className={subStyles.title}>This page doesn&apos;t exist</h1>
        <p className={subStyles.subtitle}>
          The link may be stale, or the page was renamed. Try the writing instead.
        </p>
      </header>

      <div className={styles.heroLinks}>
        <Link href="/" className={styles.heroLink}>Home</Link>
        <Link href="/whitepapers" className={styles.heroLink}>Whitepapers</Link>
        <Link href="/blog" className={styles.heroLink}>Blog</Link>
      </div>
    </main>
  );
}
