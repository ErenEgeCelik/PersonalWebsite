"use client";
import styles from "../page.module.css";
import subStyles from "../cv/cv.module.css";

const ongoing = [
  {
    title: "Reversible SAT circuits and SHA-256 logic",
    period: "2026 — present",
    desc: "Independent exploration of reversible-logic SAT solvers and their implications for cryptographic primitives. Drafting a whitepaper.",
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
    desc: "Shadow market-making model on Polymarket binary markets. Live PnL logging, inventory-aware quoting, dispatch via Claude Code agents.",
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
    desc: "Investigating Collatz trajectories represented as reversible circuits. Pattern detection in convergence-depth distributions.",
    bullets: [
      "Computational verification of sequences",
      "Pattern and statistical analysis",
      "Algorithmic explorations",
    ],
    tags: ["Theory", "Number theory"],
  },
  {
    title: "Micro Fundus Camera R&D",
    period: "2024 — present",
    desc: "Miniaturized retinal imaging device combining optics, physics, and AI. Scope being defined with collaborators.",
    bullets: [
      "Optical system design",
      "Physics-based light propagation modeling",
      "AI integration for image processing",
    ],
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
  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <div className={subStyles.eyebrow}>Research & publications</div>
        <h1 className={subStyles.title}>What I&apos;m working on</h1>
        <p className={subStyles.subtitle}>
          Ongoing threads, planned drafts, and the topics I think about most.{" "}
          <a href="mailto:erenegecelik62@gmail.com" className={subStyles.link}>
            Open to collaboration.
          </a>
        </p>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Ongoing</h2>
        </div>
        <div className={subStyles.list}>
          {ongoing.map((o) => (
            <article key={o.title} className={subStyles.row}>
              <span className={subStyles.rowDate}>{o.period}</span>
              <div className={subStyles.rowBody}>
                <div className={subStyles.rowTitle}>{o.title}</div>
                <div className={subStyles.rowDetail}>{o.desc}</div>
                <ul className={subStyles.bullets}>
                  {o.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className={subStyles.docs}>
                  {o.tags.map((t) => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
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
        <div className={styles.tags}>
          {interests.map((i) => (
            <span key={i} className={styles.tag}>{i}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
