import Link from "next/link";
import styles from "../page.module.css";
import { getAllProjects } from "@/lib/work";

export const metadata = {
  title: "Work",
  description:
    "Live systems and research on prediction markets, plus laboratory and engineering work. Everything here is something I built, derived, or falsified myself.",
  alternates: { canonical: "/work" },
};

const elsewhere = [
  {
    role: "Volunteer research intern",
    detail: "Prof. Ali Bozbey's group, TOBB ETÜ — superconducting quantum hardware",
    year: "2025",
  },
  {
    role: "Engineering intern",
    detail: "Ingenieurbüro Bickele & Bühler GmbH, Stuttgart — SMD, AOI, C# and Arduino",
    year: "2023",
  },
  {
    role: "Organizing staff",
    detail: "ICSM & ICSQMT international conferences",
    year: "2025–26",
  },
];

export default function WorkIndex() {
  const projects = getAllProjects();

  return (
    <main className={`${styles.column} ${styles.page}`}>
      <h1 className={styles.h1Page}>Work</h1>
      <p className={styles.intro}>
        Live systems and research on prediction markets, plus laboratory and engineering work.
        Everything here is something I built, derived, or falsified myself.
      </p>

      <div className={`${styles.list} ${styles.section}`}>
        {projects.map((p) => (
          <Link key={p.slug} href={`/work/${p.slug}`} className={styles.row}>
            <h2 className={styles.rowTitle}>{p.title}</h2>
            <span className={styles.rowMeta}>{p.year}</span>
            <p className={styles.rowSummary}>{p.summary}</p>
            <div className={styles.tags}>
              {p.tags.map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <section className={styles.section}>
        <p className={styles.sectionLabel} style={{ marginBottom: 18 }}>
          Elsewhere
        </p>
        <table className={styles.table}>
          <tbody>
            {elsewhere.map((e) => (
              <tr key={e.role}>
                <td className={styles.tableKey}>{e.role}</td>
                <td>{e.detail}</td>
                <td className={styles.tableEnd}>{e.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
