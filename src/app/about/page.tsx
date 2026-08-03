import Link from "next/link";
import ReactMarkdown from "react-markdown";
import styles from "../page.module.css";
import ab from "./about.module.css";
import { getAbout } from "@/lib/pages";
import { education, honors, skillGroups, RESUME_PDF } from "@/lib/resume";

export const metadata = {
  title: "About",
  description:
    "Physics undergraduate at METU building quantitative trading systems for prediction markets.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const about = getAbout();

  return (
    <main className={`${styles.column} ${styles.page}`}>
      <div className={styles.prose660}>
        <div className={ab.head}>
          {about.portrait && (
            <div className={ab.portraitWrap}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={about.portrait} alt={about.portraitAlt} className={ab.portrait} />
            </div>
          )}
          <h1 className={styles.h1Page} style={{ margin: 0 }}>
            About
          </h1>
        </div>

        <div className={ab.body}>
          <ReactMarkdown>{about.body}</ReactMarkdown>
        </div>

        <section className={styles.section}>
          <p className={styles.sectionLabel} style={{ marginBottom: 18 }}>
            Education
          </p>
          <table className={styles.table}>
            <tbody>
              {education.map((e) => (
                <tr key={e.institution}>
                  <td className={ab.eduKey}>{e.institution}</td>
                  <td>
                    {e.detail}
                    <span className={ab.eduLoc}> · {e.location}</span>
                  </td>
                  <td className={styles.tableEnd}>{e.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel} style={{ marginBottom: 18 }}>
            Honors
          </p>
          <ul className={ab.honors}>
            {honors.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <p className={styles.sectionLabel} style={{ marginBottom: 18 }}>
            Skills
          </p>
          <div className={ab.skills}>
            {skillGroups.map((g) => (
              <div key={g.label}>
                <h2 className={ab.skillLabel}>{g.label}</h2>
                <div className={styles.tags} style={{ marginTop: 12 }}>
                  {g.items.map((s) => (
                    <span key={s} className={styles.tag}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.btnRow} style={{ marginTop: 48 }}>
          <Link href="/cv" className={`${styles.btn} ${styles.btnPrimary}`}>
            Full CV
          </Link>
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            Résumé (PDF)
          </a>
          <Link href="/contact" className={`${styles.btn} ${styles.btnSecondary}`}>
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}
