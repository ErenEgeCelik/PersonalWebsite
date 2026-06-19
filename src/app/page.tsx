"use client";
import Link from "next/link";
import { useLanguage } from "./contexts/LanguageContext";
import styles from "./page.module.css";

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

const sampleTrades = [
  { ts: "12:08:42", side: "buy", ticker: "BTC-UP", detail: "q=0.61 · $0.48 → $0.52", pnl: "+ $8.40", pnlSign: "pos" },
  { ts: "12:03:11", side: "sell", ticker: "ETH-DN", detail: "q=0.43 · $0.51 → $0.49", pnl: "+ $4.20", pnlSign: "pos" },
  { ts: "11:58:55", side: "buy", ticker: "BTC-DN", detail: "q=0.55 · $0.47 → $0.46", pnl: "− $2.10", pnlSign: "neg" },
];

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.eyebrow}>
          <span className={styles.pulse} />
          {t("hero.eyebrow")}
        </div>
        <h1 className={styles.headline}>
          {t("hero.headline.1")}
          <br />
          {t("hero.headline.2")}
          <span className={styles.accent}>{t("hero.headline.3")}</span>
          {t("hero.headline.4")}
        </h1>
        <p className={styles.lede}>{t("hero.lede")}</p>
        <div className={styles.ctas}>
          <Link href="/whitepapers/polymarket-5min-microstructure" className={`${styles.btn} ${styles.btnPrimary}`}>
            {t("hero.cta.primary")} <span className={styles.arrow}>→</span>
          </Link>
          <Link href="/research" className={`${styles.btn} ${styles.btnGhost}`}>
            {t("hero.cta.secondary")}
          </Link>
        </div>
        <div className={styles.metaRow}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{t("hero.meta.location")}</span>
            <span className={styles.metaValue}>{t("hero.meta.location.value")}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{t("hero.meta.updated")}</span>
            <span className={`${styles.metaValue} ${styles.mono}`}>2026-06-19</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{t("hero.meta.active")}</span>
            <span className={`${styles.metaValue} ${styles.mono}`}>{t("hero.meta.active.value")}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>{t("hero.meta.contact")}</span>
            <a href="mailto:erenegecelik62@gmail.com" className={`${styles.metaValue} ${styles.mono} ${styles.metaLink}`}>
              erenegecelik62@gmail.com
            </a>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{t("section.recent.research")}</h2>
          <Link href="/research" className={styles.more}>
            {t("section.all")} →
          </Link>
        </div>
        <div className={styles.entries}>
          {research.map((r) => (
            <article key={r.title} className={styles.entry}>
              <span className={styles.entryDate}>{r.date}</span>
              <div className={styles.entryBody}>
                <Link href={r.href} className={styles.entryTitle}>{r.title}</Link>
                <p className={styles.entryDesc}>{r.desc}</p>
              </div>
              <Link href={r.href} className={styles.entryAction}>
                {r.action} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{t("section.live.pnl")}</h2>
          <Link href="/trades" className={styles.more}>
            {t("section.full.log")} →
          </Link>
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelHeadLeft}>
              <span className={styles.panelPulse} />
              <span className={styles.panelTitle}>polymarket-mm</span>
            </div>
            <span className={styles.panelSub}>
              {t("trades.paper.pnl")}: <span className={styles.pnlPos}>+ $124.83</span>
            </span>
          </div>
          {sampleTrades.map((tr) => (
            <div key={tr.ts} className={styles.tradeRow}>
              <span className={styles.ts}>{tr.ts}</span>
              <span className={`${styles.side} ${tr.side === "buy" ? styles.sideBuy : styles.sideSell}`}>
                {tr.side.toUpperCase()}
              </span>
              <span className={styles.ticker}>{tr.ticker}</span>
              <span className={styles.tradeDetail}>{tr.detail}</span>
              <span className={`${styles.pnl} ${tr.pnlSign === "pos" ? styles.pnlPos : styles.pnlNeg}`}>
                {tr.pnl}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>{t("section.projects")}</h2>
        </div>
        <div className={styles.grid}>
          {projects.map((p) => (
            <article key={p.title} className={styles.card}>
              <div className={styles.cardHead}>
                <h3 className={styles.cardTitle}>{p.title}</h3>
                <span className={`${styles.badge} ${styles[`badge_${p.badge}`]}`}>
                  {t(p.badgeKey)}
                </span>
              </div>
              <p className={styles.cardDesc}>{p.desc}</p>
              <div className={styles.cardMeta}>
                <div className={styles.tags}>
                  {p.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>{tag}</span>
                  ))}
                </div>
                <span className={styles.cardStat}>{p.stat}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
