import styles from "./Footer.module.css";
import { SITE_EMAIL, SITE_GITHUB } from "@/lib/site";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        erenegecelik <span className={styles.sep}>·</span> built with Next.js <span className={styles.sep}>·</span> İzmir / Ankara, TR
      </div>
      <div className={styles.right}>
        <a href={SITE_GITHUB} target="_blank" rel="noopener noreferrer" className={styles.link}>github</a>
        <a href={`mailto:${SITE_EMAIL}`} className={styles.link}>email</a>
        <a href="/feed.xml" className={styles.link}>rss</a>
      </div>
    </footer>
  );
}
