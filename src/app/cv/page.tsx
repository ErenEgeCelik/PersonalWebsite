"use client";
import styles from "../page.module.css";
import subStyles from "./cv.module.css";
import { useLanguage } from "../contexts/LanguageContext";

const education = [
  {
    institution: "Middle East Technical University (METU)",
    period: "2025 — present",
    field: "Physics (BSc) · 2nd year",
    detail: "Current GPA 3.63 / 4.00 · transferred from İZTECH",
    docs: [{ label: "transcript", href: "/transkriptim.JPG" }],
  },
  {
    institution: "İzmir Institute of Technology (İZTECH)",
    period: "2024 — 2025",
    field: "Physics (BSc) · 1st year",
    detail: "Final GPA 3.56 / 4.00 · transferred to METU",
    docs: [],
  },
  {
    institution: "Kadir Has University — summer school",
    period: "2023",
    field: "University-level physics",
    detail: "Augmented Electricity & Magnetism · Augmented Mechanics",
    docs: [
      { label: "E&M certificate", href: "/documents/kadir-has-certificate-1.pdf" },
      { label: "Mechanics certificate", href: "/documents/kadir-has-certificate-2.pdf" },
    ],
  },
  {
    institution: "Advanced Placement (AP) Program",
    period: "high school",
    field: "College Board AP — multiple subjects",
    detail: "University-credit courses during high school",
    docs: [
      { label: "score report", href: "/documents/ap-score-report.pdf" },
      { label: "awards", href: "/documents/ap-awards.pdf" },
    ],
  },
];

const experience = [
  {
    role: "Intern — semiconductor technologies",
    company: "Germany",
    period: "2023 (12th grade break)",
    summary: "Hands-on experience in chip production processes, semiconductor research, applied physics integration.",
    bullets: [
      "Chip production process exposure",
      "Semiconductor R&D observation",
      "Applied physics in industrial setting",
      "International work environment",
    ],
    docs: [{ label: "internship certificate", href: "/documents/internship-certificate.pdf" }],
  },
];

const certificates = [
  { title: "TOEFL iBT", issuer: "ETS", year: "2024" },
  { title: "AP Awards", issuer: "College Board", year: "high school" },
];

const skills = [
  { group: "Languages", items: ["C", "Python", "C#", "TypeScript"] },
  { group: "Domains", items: ["Theoretical Physics", "Quantum Computing", "Algorithm Analysis", "Reversible Computing"] },
  { group: "Tools", items: ["Git", "Linux", "Next.js", "Three.js"] },
];

const langs = [
  { name: "Turkish", level: "native" },
  { name: "English", level: "advanced · TOEFL iBT" },
  { name: "German", level: "beginner" },
];

export default function CVPage() {
  const { t } = useLanguage();

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <div className={subStyles.eyebrow}>Curriculum vitae</div>
        <h1 className={subStyles.title}>Eren Ege Çelik</h1>
        <p className={subStyles.subtitle}>
          Physics · METU · Ankara, TR ·{" "}
          <a href="mailto:erenegecelik62@gmail.com" className={subStyles.link}>
            erenegecelik62@gmail.com
          </a>{" "}
          ·{" "}
          <a href="https://github.com/ErenEgeCelik" target="_blank" rel="noopener noreferrer" className={subStyles.link}>
            github.com/ErenEgeCelik
          </a>
        </p>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Education</h2>
        </div>
        <div className={subStyles.list}>
          {education.map((e) => (
            <article key={e.institution} className={subStyles.row}>
              <span className={subStyles.rowDate}>{e.period}</span>
              <div className={subStyles.rowBody}>
                <div className={subStyles.rowTitle}>{e.institution}</div>
                <div className={subStyles.rowMeta}>{e.field}</div>
                <div className={subStyles.rowDetail}>{e.detail}</div>
                {e.docs.length > 0 && (
                  <div className={subStyles.docs}>
                    {e.docs.map((d) => (
                      <a key={d.href} href={d.href} target="_blank" rel="noopener noreferrer" className={subStyles.doc}>
                        {d.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Experience</h2>
        </div>
        <div className={subStyles.list}>
          {experience.map((e) => (
            <article key={e.role} className={subStyles.row}>
              <span className={subStyles.rowDate}>{e.period}</span>
              <div className={subStyles.rowBody}>
                <div className={subStyles.rowTitle}>
                  {e.role} <span className={subStyles.rowCo}>· {e.company}</span>
                </div>
                <div className={subStyles.rowDetail}>{e.summary}</div>
                <ul className={subStyles.bullets}>
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                {e.docs.length > 0 && (
                  <div className={subStyles.docs}>
                    {e.docs.map((d) => (
                      <a key={d.href} href={d.href} target="_blank" rel="noopener noreferrer" className={subStyles.doc}>
                        {d.label} ↗
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Skills</h2>
        </div>
        <div className={subStyles.skillsGrid}>
          {skills.map((s) => (
            <div key={s.group} className={subStyles.skillBlock}>
              <div className={subStyles.skillLabel}>{s.group}</div>
              <div className={subStyles.skillTags}>
                {s.items.map((i) => (
                  <span key={i} className={styles.tag}>{i}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Certificates</h2>
        </div>
        <div className={subStyles.certList}>
          {certificates.map((c) => (
            <div key={c.title} className={subStyles.certRow}>
              <span className={subStyles.certTitle}>{c.title}</span>
              <span className={subStyles.certIssuer}>{c.issuer}</span>
              <span className={subStyles.certYear}>{c.year}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Languages</h2>
        </div>
        <div className={subStyles.certList}>
          {langs.map((l) => (
            <div key={l.name} className={subStyles.certRow}>
              <span className={subStyles.certTitle}>{l.name}</span>
              <span className={subStyles.certIssuer}>{l.level}</span>
              <span />
            </div>
          ))}
        </div>
      </section>

      <div className={subStyles.downloadWrap}>
        <a href="/cv.pdf" target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.btnPrimary}`}>
          {t("download.full.cv")} <span className={styles.arrow}>↓</span>
        </a>
      </div>
    </main>
  );
}
