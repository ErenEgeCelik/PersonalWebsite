"use client";
import Link from "next/link";
import { useLanguage } from "./contexts/LanguageContext";
import styles from "./page.module.css";
import tradesData from "../../public/data/trades.json";
import { formatPaperPnl, type TradesData } from "@/lib/trades";

const trades = tradesData as TradesData;

const research = [
  {
    date: "2026-06-17",
    title: "Microstructure & efficiency of Polymarket's 5-min crypto binary markets",
    desc: "An ~84-hour empirical study: the MM is a calibrated Brownian-probit pricer; every candidate edge fails out-of-sample. The verifier-first protocol is the contribution.",
    action: "read",
    href: "/whitepapers/polymarket-5min-microstructure",
  },
  {
    date: "2026-05-20",
    title: "Polymarket MM — shadow model v2",
    desc: "Inventory-aware spread widening on BTC/ETH 5-min binary markets.",
    action: "log",
    href: "/trades",
  },
  {
    date: "2026-04-02",
    title: "Collatz under reversible encoding",
    desc: "Trajectories as reversible circuits — convergence depth patterns.",
    action: "note",
    href: "/research",
  },
];

const projects = [
  {
    title: "GridNode",
    badge: "active",
    badgeKey: "status.active",
    desc: "Distributed orchestrator splitting scientific workloads across heterogeneous nodes.",
    tags: ["C", "Python"],
    stat: "v0.4 · 1.2k LOC",
  },
  {
    title: "Crypto-bot",
    badge: "live",
    badgeKey: "status.live",
    desc: "Shadow market-making on Polymarket. VPS-deployed, scheduled Claude-Code research loop.",
    tags: ["Python", "Polymarket"],
    stat: "running on VPS-IE",
  },
  {
    title: "Reversible SAT",
    badge: "draft",
    badgeKey: "status.whitepaper",
    desc: "Reversible-logic SAT solvers and cryptographic implications.",
    tags: ["Theory", "Crypto"],
    stat: "draft · 18 pages",
  },
  {
    title: "Micro Fundus Camera",
    badge: "planned",
    badgeKey: "status.planned",
    desc: "Miniaturized retinal imaging combining optics and AI.",
    tags: ["Optics"],
    stat: "scoping",
  },
];


export default function Home() {
  const { t } = useLanguage();

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <p className={styles.lede}>
          Physics undergrad at METU (İzmir/Ankara). Independent quantitative researcher — I reverse-engineer market makers, derive fair-value models from first principles, and trade prediction markets live. Grew $30 → ~$1,200 on Polymarket over three months.
        </p>
        <div className={styles.heroLinks}>
          <a href="https://github.com/ErenEgeCelik" target="_blank" rel="noopener noreferrer" className={styles.heroLink}>
            GitHub
          </a>
          <a href="mailto:erenege3500@gmail.com" className={styles.heroLink}>
            Email
          </a>
          <a href="/cv" className={styles.heroLink}>
            CV
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent</h2>
        <div className={styles.plainList}>
          {research.map((r) => (
            <Link key={r.title} href={r.href} className={styles.plainRow}>
              <div className={styles.plainRowMain}>
                <span className={styles.plainRowTitle}>{r.title}</span>
                <span className={styles.plainRowDesc}>{r.desc}</span>
              </div>
              <span className={styles.plainRowDate}>{r.date}</span>
            </Link>
          ))}
        </div>
        <div className={styles.sectionMore}>
          <Link href="/research" className={styles.moreLink}>See all →</Link>
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
                  <span className={styles.plainRowBadge}>{t(p.badgeKey).toLowerCase()}</span>
                </span>
                <span className={styles.plainRowDesc}>{p.desc}</span>
              </div>
              <span className={styles.plainRowDate}>{p.stat}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Live</h2>
        <p className={styles.liveLine}>
          <span className={styles.livePulse} />
          <span>
            Polymarket shadow bot · paper PnL last 24h{" "}
            <span className={trades.summary.paperPnl24h >= 0 ? styles.pnlPos : styles.pnlNeg}>
              {formatPaperPnl(trades.summary.paperPnl24h)}
            </span>{" "}
            over {trades.summary.tradesCount24h} trades
          </span>
        </p>
        <div className={styles.sectionMore}>
          <Link href="/trades" className={styles.moreLink}>See feed →</Link>
        </div>
      </section>
    </main>
  );
}
