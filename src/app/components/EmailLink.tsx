"use client";
import { useState } from "react";
import styles from "./EmailLink.module.css";
import { SITE_EMAIL } from "@/lib/site";

/**
 * Shows the address in full rather than hiding it behind a "Email" label —
 * a mailto: link is useless without a configured mail client. Click copies.
 */
export default function EmailLink() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(SITE_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the address is visible anyway */
    }
  }

  return (
    <button type="button" onClick={copy} className={styles.email} title="Copy to clipboard">
      <span className={styles.address}>{SITE_EMAIL}</span>
      <span className={`${styles.hint} ${copied ? styles.hintOn : ""}`} aria-live="polite">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}
