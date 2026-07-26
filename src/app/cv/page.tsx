import styles from "../page.module.css";
import subStyles from "./cv.module.css";

export const metadata = {
  title: "CV",
  description:
    "Education, honors, experience and research of Eren Ege Çelik — physics undergrad at METU and independent quantitative researcher.",
  alternates: { canonical: "/cv" },
};

const education = [
  {
    institution: "Middle East Technical University (ODTÜ)",
    location: "Ankara, Turkey",
    period: "2024 — 2028 (expected)",
    detail: "BSc, Physics",
  },
  {
    institution: "İzmir Institute of Technology (İYTE)",
    location: "İzmir, Turkey",
    period: "transferred",
    detail: "Physics · GPA 3.6 / 4.0",
  },
];

const honors = [
  "İzmir Mathematics Olympiad Team — regional team, grades 8–9",
  "Physics Olympiad Team, İzmir Atatürk High School (among Turkey's top 5)",
  "Admitted to İzmir Atatürk High School via nationally competitive exam (top ~0.2%)",
];

const experience = [
  {
    role: "Independent Quantitative Researcher & Trader",
    context: "Prediction Markets · Self-directed, live trading on Polymarket",
    location: "Remote",
    period: "2026 — present",
    bullets: [
      "Grew a single $30 deposit to ~$1,200 in net P&L over three months of live trading, no additional capital.",
      "Reverse-engineered the dominant market maker on Polymarket's BTC 5-minute contracts — identified its price-feed composition via exclusive falsification testing, achieved ~6-tick out-of-sample replication of its quotes. Documented in a working paper.",
      "Derived a Brownian-probit fair-value model and a binary-CARA inventory-skew rule from first principles; validated against logged data (within-slot R² ≈ 0.92).",
      "Built and iterated weather-derivative strategies as MMs adapted — static bucket → reactive trigger → probabilistic forecast engine blending a personal weather station, public forecasts, and live METAR data via Bayesian updating.",
      "Designed a World Cup cross-market latency-arbitrage strategy linking match markets to dependent group-advancement markets through Bayesian updating and Poisson goal modeling.",
      "Built low-latency multi-venue data infrastructure: direct WebSocket feeds (Binance, Coinbase, Kraken, Bitstamp), Chainlink oracle relay, Polymarket CLOB, deployed on AWS Ireland.",
    ],
  },
  {
    role: "Volunteer Research Intern",
    context: "Prof. Ali Bozbey's Group, TOBB ETÜ · Superconducting / quantum-computing hardware",
    location: "Ankara, Turkey",
    period: "Summer 2025",
    bullets: [
      "Joined the group (which built Turkey's first superconducting quantum-computing hardware) on a volunteer basis after connecting with the team at ICSM; contributed to lab work over two weeks.",
    ],
  },
  {
    role: "Engineering Intern",
    context: "Ingenieurbüro Bickele & Bühler GmbH · Electronics manufacturing & software",
    location: "Stuttgart, Germany",
    period: "Nov 2023",
    bullets: [
      "Worked across SMD pick-and-place, AOI, laser and soldering operations, incoming-goods QC, and device assembly; wrote software in C# and Arduino.",
    ],
  },
];

const research = [
  {
    title: "Reverse-Engineering a Prediction Market Maker",
    detail: "Feed identification, volatility dynamics, and out-of-sample replication evidence from Polymarket BTC contracts.",
    href: "/whitepapers/polymarket-5min-microstructure",
  },
  {
    title: "Binary Market Making",
    detail: "Inventory-skew derivation under CARA utility, adverse-selection analysis, and empirical verdicts under realistic execution.",
    href: null,
  },
];

const activities = [
  "Organizing Staff — International Conference on Superconductivity and Magnetism (ICSM) & ICSQMT, 2025 & 2026",
];

const skills = {
  Quantitative: "probability & statistics, Bayesian inference, stochastic modeling, time-series analysis, market microstructure, derivatives pricing",
  Technical: "Python (pandas, NumPy), C#, low-latency WebSocket data systems, CLOB / REST APIs, Polygon / USDC / DeFi tooling, multi-agent coding workflows",
};

export default function CVPage() {
  return (
    <main className={styles.main}>
      <header className={subStyles.header}>
        <h1 className={subStyles.title}>Eren Ege Çelik</h1>
        <p className={subStyles.subtitle}>
          İzmir, Turkey · {" "}
          <a href="mailto:erenege3500@gmail.com" className={subStyles.link}>erenege3500@gmail.com</a> · {" "}
          <a href="https://github.com/ErenEgeCelik" target="_blank" rel="noopener noreferrer" className={subStyles.link}>github.com/ErenEgeCelik</a>
        </p>
        <div className={subStyles.downloadRow}>
          <a href="/Eren_Ege_Celik_Resume.pdf" target="_blank" rel="noopener noreferrer" className={subStyles.downloadLink}>
            Download PDF →
          </a>
        </div>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Education</h2>
        <div className={subStyles.list}>
          {education.map((e) => (
            <article key={e.institution} className={subStyles.row}>
              <span className={subStyles.rowDate}>{e.period}</span>
              <div className={subStyles.rowBody}>
                <div className={subStyles.rowTitle}>
                  {e.institution} <span className={subStyles.rowCo}>· {e.location}</span>
                </div>
                <div className={subStyles.rowDetail}>{e.detail}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Honors &amp; Selection</h2>
        <ul className={subStyles.bullets}>
          {honors.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Experience</h2>
        <div className={subStyles.list}>
          {experience.map((e) => (
            <article key={e.role} className={subStyles.row}>
              <span className={subStyles.rowDate}>{e.period}</span>
              <div className={subStyles.rowBody}>
                <div className={subStyles.rowTitle}>
                  {e.role} <span className={subStyles.rowCo}>· {e.location}</span>
                </div>
                <div className={subStyles.rowMeta}>{e.context}</div>
                <ul className={subStyles.bullets}>
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
        <h2 className={styles.sectionTitle}>Research &amp; Writing</h2>
        <div className={subStyles.list}>
          {research.map((r) => (
            <article key={r.title} className={subStyles.row}>
              <span className={subStyles.rowDate}>paper</span>
              <div className={subStyles.rowBody}>
                <div className={subStyles.rowTitle}>
                  {r.href ? (
                    <a href={r.href} className={subStyles.link}>{r.title}</a>
                  ) : (
                    <>{r.title} <span className={subStyles.rowCo}>· in preparation</span></>
                  )}
                </div>
                <div className={subStyles.rowDetail}>{r.detail}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Skills</h2>
        <dl className={subStyles.skillsDl}>
          {Object.entries(skills).map(([group, items]) => (
            <div key={group} className={subStyles.skillsRow}>
              <dt className={subStyles.skillsDt}>{group}</dt>
              <dd className={subStyles.skillsDd}>{items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Activities</h2>
        <ul className={subStyles.bullets}>
          {activities.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
