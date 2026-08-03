"use client";
import styles from "../article.module.css";

export default function PrintButton() {
  return (
    <button
      type="button"
      className={styles.printBtn}
      onClick={() => window.print()}
      aria-label="Print or save as PDF"
    >
      Print · PDF
    </button>
  );
}
