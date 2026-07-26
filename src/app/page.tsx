import Link from "next/link";
import styles from "./page.module.css";
import { getAllPosts } from "@/lib/blog";
import { getAllWhitepapers } from "@/lib/whitepapers";
import { SITE_EMAIL, SITE_GITHUB } from "@/lib/site";

const projects = [
  {
    title: "Crypto-bot",
    badge: "live",
    desc: "Shadow market-making on Polymarket. VPS-deployed, scheduled Claude-Code research loop.",
    stat: "running on VPS-IE",
  },
  {
    title: "GridNode",
    badge: "active",
    desc: "Distributed orchestrator splitting scientific workloads across heterogeneous nodes.",
    stat: "v0.4 · 1.2k LOC",
  },
  {
    title: "Reversible SAT",
    badge: "draft",
    desc: "Reversible-logic SAT solvers and cryptographic implications.",
    stat: "draft · 18 pages",
  },
  {
    title: "Micro Fundus Camera",
    badge: "planned",
    desc: "Miniaturized retinal imaging combining optics and AI.",
    stat: "scoping",
  },
];

/** Newest writing across both collections — updates itself when content is added. */
function recentWriting(limit = 5) {
  const papers = getAllWhitepapers().map((p) => ({
    date: p.date,
    title: p.title,
    desc: p.summary,
    href: `/whitepapers/${p.slug}`,
  }));
  const posts = getAllPosts().map((p) => ({
    date: p.date,
    title: p.title,
    desc: p.summary,
    href: `/blog/${p.slug}`,
  }));
  return [...papers, ...posts]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, limit);
}

export default function Home() {
  const recent = recentWriting();

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <p className={styles.lede}>
          Physics undergrad at METU (İzmir/Ankara). Independent quantitative researcher — I reverse-engineer market makers, derive fair-value models from first principles, and trade prediction markets live. Grew $30 → ~$1,200 on Polymarket over three months.
        </p>
        <div className={styles.heroLinks}>
          <a href={SITE_GITHUB} target="_blank" rel="noopener noreferrer" className={styles.heroLink}>
            GitHub
          </a>
          <a href={`mailto:${SITE_EMAIL}`} className={styles.heroLink}>
            Email
          </a>
          <Link href="/cv" className={styles.heroLink}>
            CV
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Writing</h2>
        <div className={styles.plainList}>
          {recent.map((r) => (
            <Link key={r.href} href={r.href} className={styles.plainRow}>
              <div className={styles.plainRowMain}>
                <span className={styles.plainRowTitle}>{r.title}</span>
                {r.desc && <span className={styles.plainRowDesc}>{r.desc}</span>}
              </div>
              <span className={styles.plainRowDate}>{r.date}</span>
            </Link>
          ))}
        </div>
        <div className={styles.sectionMore}>
          <Link href="/whitepapers" className={styles.moreLink}>All whitepapers →</Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Building</h2>
        <div className={styles.plainList}>
          {projects.map((p) => (
            <div key={p.title} className={styles.plainRow}>
              <div className={styles.plainRowMain}>
                <span className={styles.plainRowTitle}>
                  {p.title}
                  <span className={styles.plainRowBadge}>{p.badge}</span>
                </span>
                <span className={styles.plainRowDesc}>{p.desc}</span>
              </div>
              <span className={styles.plainRowDate}>{p.stat}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
