import styles from "./Footer.module.css";
import shared from "../page.module.css";
import { SITE_EMAIL, SITE_GITHUB } from "@/lib/site";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={shared.column}>
        <div className={shared.rule} />
        <div className={styles.row}>
          <span className={styles.credit}>© 2026 Eren Ege Çelik · İzmir &amp; Ankara</span>
          <a href={`mailto:${SITE_EMAIL}`} className={styles.link}>
            Email
          </a>
          <a href={SITE_GITHUB} target="_blank" rel="noopener noreferrer" className={styles.link}>
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
