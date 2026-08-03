import Link from "next/link";
import styles from "../page.module.css";
import c from "./contact.module.css";
import { SITE_EMAIL, SITE_GITHUB } from "@/lib/site";
import { RESUME_PDF } from "@/lib/resume";

export const metadata = {
  title: "Contact",
  description: "How to reach Eren Ege Çelik.",
  alternates: { canonical: "/contact" },
};

const rows = [
  { label: "Email", value: SITE_EMAIL, href: `mailto:${SITE_EMAIL}`, external: false },
  { label: "GitHub", value: "github.com/ErenEgeCelik", href: SITE_GITHUB, external: true },
  { label: "CV", value: "The full résumé, rendered", href: "/cv", external: false },
];

export default function ContactPage() {
  return (
    <main className={`${styles.column} ${styles.page}`}>
      <div className={styles.prose620}>
        <h1 className={styles.h1Page}>Contact</h1>
        <p className={c.lead}>
          I&apos;m looking for a quantitative research or trading role — internship or full-time,
          location flexible. I&apos;m equally glad to hear from anyone who wants to argue about
          market microstructure, a derivation, or one of the results here. I answer everything.
        </p>

        <div className={c.rows}>
          {rows.map((r) =>
            r.external ? (
              <a
                key={r.label}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className={c.row}
              >
                <span className={c.label}>{r.label}</span>
                <span className={c.value}>{r.value}</span>
              </a>
            ) : (
              <Link key={r.label} href={r.href} className={c.row}>
                <span className={c.label}>{r.label}</span>
                <span className={c.value}>{r.value}</span>
              </Link>
            ),
          )}
        </div>

        <div className={styles.btnRow} style={{ marginTop: 36 }}>
          <a href={`mailto:${SITE_EMAIL}`} className={`${styles.btn} ${styles.btnPrimary}`}>
            Write to me
          </a>
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            Résumé (PDF)
          </a>
        </div>
      </div>
    </main>
  );
}
