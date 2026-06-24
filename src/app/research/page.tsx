import styles from "../page.module.css";
import subStyles from "../cv/cv.module.css";
import { tagHref } from "@/lib/content";
import Link from "next/link";

const ongoing = [
  {
    title: "Reversible SAT circuits and SHA-256 logic",
    period: "2026 — present",
    summary:
      "Independent exploration of reversible-logic SAT solvers and their implications for cryptographic primitives. Drafting a whitepaper.",
    bullets: [
      "Reversible SAT circuit design and implementation",
      "Information-theoretic approaches to complexity",
      "SHA-256 logic design and cryptographic applications",
    ],
    tags: ["Theory", "Crypto"],
  },
  {
    title: "Polymarket BTC/ETH 5-min market microstructure",
    period: "2026 — present",
    summary:
      "Shadow market-making model on Polymarket binary markets. Live PnL logging, inventory-aware quoting, dispatch via Claude Code agents.",
    bullets: [
      "VPS-deployed live shadow loop",
      "Daily scheduled research turn (GitHub Actions + Claude Code)",
      "Inventory-aware spread widening (v2)",
    ],
    tags: ["Markets", "Polymarket", "Live"],
  },
  {
    title: "Collatz under reversible encoding",
    period: "2024 — present",
    summary:
      "Investigating Collatz trajectories represented as reversible circuits. Pattern detection in convergence-depth distributions.",
    bullets: [],
    tags: ["Theory", "Number theory"],
  },
  {
    title: "Micro Fundus Camera R&D",
    period: "2024 — present",
    summary:
      "Miniaturized retinal imaging device combining optics, physics, and AI. Scope being defined with collaborators.",
    bullets: [],
    tags: ["Optics", "Medical AI"],
  },
];

const planned = [
  { title: "Computational approaches to the Collatz conjecture", status: "in preparation" },
  { title: "Reversible logic circuits for cryptographic applications", status: "research phase" },
  { title: "Information theory and computational complexity", status: "conceptual" },
];

const interests = [
  "Collatz Conjecture", "P vs NP", "Reversible Computing",
  "Quantum Physics", "Algorithm Analysis", "Cryptography",
  "Information Theory", "Computational Complexity", "Semiconductor Physics",
];

export default function ResearchPage() {
  const [featured, ...rest] = ongoing;

  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <div className={subStyles.eyebrow}>Research &amp; publications</div>
        <h1 className={subStyles.title}>What I&apos;m working on</h1>
        <p className={subStyles.subtitle}>
          Ongoing threads, planned drafts, and the topics I think about most.{" "}
          <a href="mailto:erenegecelik62@gmail.com" className={subStyles.link}>
            Open to collaboration.
          </a>
        </p>
      </header>

      <section className={styles.section} style={{ marginBottom: 24 }}>
        <div className={styles.featured} style={{ cursor: "default" }}>
          <div className={styles.featuredEyebrow}>
            <span className={styles.kind}>Primary thread</span>
            <span className={styles.sep}>·</span>
            <span>{featured.period}</span>
          </div>
          <h2 className={styles.featuredTitle}>{featured.title}</h2>
          <p className={styles.featuredSummary}>{featured.summary}</p>
          {featured.bullets.length > 0 && (
            <ul className={subStyles.bullets} style={{ marginBottom: 18, maxWidth: 720 }}>
              {featured.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
          <div className={styles.featuredFoot}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {featured.tags.map((t) => (
                <Link key={t} href={tagHref(t)} className={styles.tag}>{t}</Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Other threads</h2>
        </div>
        <div className={styles.cardGrid}>
          {rest.map((r) => (
            <div key={r.title} className={styles.contentCard} style={{ cursor: "default" }}>
              <div className={styles.cardEyebrow}>
                <span>{r.period}</span>
              </div>
              <h3 className={styles.cardTitle}>{r.title}</h3>
              <p className={styles.cardSummary}>{r.summary}</p>
              <div className={styles.cardFoot}>
                {r.tags.map((t) => (
                  <Link key={t} href={tagHref(t)} className={styles.tag}>{t}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Planned publications</h2>
        </div>
        <div className={subStyles.certList}>
          {planned.map((p) => (
            <div key={p.title} className={subStyles.certRow}>
              <span className={subStyles.certTitle}>{p.title}</span>
              <span className={subStyles.certIssuer}>{p.status}</span>
              <span />
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Interests</h2>
        </div>
        <div className={styles.tags} style={{ gap: 8 }}>
          {interests.map((i) => (
            <Link key={i} href={tagHref(i)} className={styles.tag} style={{ fontSize: 12, padding: "6px 10px" }}>
              {i}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
