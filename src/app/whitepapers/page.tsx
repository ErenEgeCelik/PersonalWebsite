"use client";
import { useLanguage } from "../contexts/LanguageContext";
import styles from "../page.module.css";
import comingStyles from "./coming.module.css";

export default function WhitepapersPage() {
  const { t } = useLanguage();
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Whitepapers</h2>
          <span className={styles.more}>{t("coming.soon")}</span>
        </div>
        <div className={comingStyles.placeholder}>
          <p className={comingStyles.text}>{t("whitepapers.coming")}</p>
          <div className={comingStyles.plannedList}>
            <div className={comingStyles.row}>
              <span className={comingStyles.date}>2026 Q3</span>
              <span className={comingStyles.title}>Reversible SAT circuits and SHA-256 logic</span>
              <span className={comingStyles.status}>draft · 18 pages</span>
            </div>
            <div className={comingStyles.row}>
              <span className={comingStyles.date}>2026 Q4</span>
              <span className={comingStyles.title}>Polymarket BTC/ETH 5-min market microstructure</span>
              <span className={comingStyles.status}>outline</span>
            </div>
            <div className={comingStyles.row}>
              <span className={comingStyles.date}>2027 Q1</span>
              <span className={comingStyles.title}>Collatz under reversible encoding — convergence patterns</span>
              <span className={comingStyles.status}>research</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
