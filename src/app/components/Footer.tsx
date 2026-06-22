"use client";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.left}>
        erenege.com <span className={styles.sep}>·</span> built with Next.js <span className={styles.sep}>·</span> Ankara, TR
      </div>
      <div className={styles.right}>
        <a href="https://github.com/ErenEgeCelik" target="_blank" rel="noopener noreferrer" className={styles.link}>github</a>
        <a href="mailto:erenegecelik62@gmail.com" className={styles.link}>email</a>
        <a href="/feed.xml" className={styles.link}>rss</a>
      </div>
    </footer>
  );
}
