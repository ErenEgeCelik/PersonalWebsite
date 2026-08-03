import Link from "next/link";
import styles from "../page.module.css";
import cv from "./cv.module.css";
import { SITE_EMAIL, SITE_GITHUB } from "@/lib/site";
import {
  education,
  honors,
  experience,
  research,
  activities,
  skillsProse,
  RESUME_PDF,
} from "@/lib/resume";

export const metadata = {
  title: "CV",
  description:
    "Education, honors, experience and research of Eren Ege Çelik — physics undergraduate at METU and independent quantitative researcher.",
  alternates: { canonical: "/cv" },
};

export default function CVPage() {
  return (
    <main className={`${styles.column} ${styles.page}`}>
      <header className={cv.head}>
        <h1 className={styles.h1Page} style={{ marginBottom: 14 }}>
          Eren Ege Çelik
        </h1>
        <p className={cv.contact}>
          İzmir, Turkey ·{" "}
          <a href={`mailto:${SITE_EMAIL}`}>{SITE_EMAIL}</a> ·{" "}
          <a href={SITE_GITHUB} target="_blank" rel="noopener noreferrer">
            github.com/ErenEgeCelik
          </a>
        </p>
        <div className={styles.btnRow}>
          <a
            href={RESUME_PDF}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Download PDF
          </a>
        </div>
      </header>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Education</p>
        <div className={cv.list}>
          {education.map((e) => (
            <article key={e.institution} className={cv.row}>
              <span className={cv.when}>{e.period}</span>
              <div>
                <h2 className={cv.what}>
                  {e.institution} <span className={cv.where}>· {e.location}</span>
                </h2>
                <p className={cv.detail}>{e.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Honors &amp; selection</p>
        <ul className={cv.bullets}>
          {honors.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Experience</p>
        <div className={cv.list}>
          {experience.map((e) => (
            <article key={e.role} className={cv.row}>
              <span className={cv.when}>{e.period}</span>
              <div>
                <h2 className={cv.what}>
                  {e.role} <span className={cv.where}>· {e.location}</span>
                </h2>
                <p className={cv.context}>{e.context}</p>
                <ul className={cv.bullets}>
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Research &amp; writing</p>
        <div className={cv.list}>
          {research.map((r) => (
            <article key={r.title} className={cv.row}>
              <span className={cv.when}>paper</span>
              <div>
                <h2 className={cv.what}>
                  {r.href ? (
                    <Link href={r.href}>{r.title}</Link>
                  ) : (
                    <>
                      {r.title} <span className={cv.where}>· in preparation</span>
                    </>
                  )}
                </h2>
                <p className={cv.detail}>{r.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Skills</p>
        <dl className={cv.skills}>
          {Object.entries(skillsProse).map(([group, items]) => (
            <div key={group} className={cv.skillRow}>
              <dt className={cv.skillKey}>{group}</dt>
              <dd className={cv.skillVal}>{items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section}>
        <p className={styles.sectionLabel}>Activities</p>
        <ul className={cv.bullets}>
          {activities.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
