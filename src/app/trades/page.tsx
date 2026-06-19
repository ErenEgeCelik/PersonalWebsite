"use client";
import { useLanguage } from "../contexts/LanguageContext";
import styles from "../page.module.css";
import tradeStyles from "./trades.module.css";

const sampleTrades = [
  { ts: "12:08:42", side: "buy", ticker: "BTC-UP", detail: "q=0.61 · $0.48 → $0.52", pnl: "+ $8.40", pnlSign: "pos" },
  { ts: "12:03:11", side: "sell", ticker: "ETH-DN", detail: "q=0.43 · $0.51 → $0.49", pnl: "+ $4.20", pnlSign: "pos" },
  { ts: "11:58:55", side: "buy", ticker: "BTC-DN", detail: "q=0.55 · $0.47 → $0.46", pnl: "− $2.10", pnlSign: "neg" },
  { ts: "11:53:02", side: "sell", ticker: "ETH-UP", detail: "q=0.49 · $0.50 → $0.50", pnl: "± $0.00", pnlSign: "flat" },
  { ts: "11:48:30", side: "buy", ticker: "BTC-UP", detail: "q=0.58 · $0.49 → $0.51", pnl: "+ $3.10", pnlSign: "pos" },
];

export default function TradesPage() {
  const { t } = useLanguage();
  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Trades</h2>
          <span className={styles.more}>{t("coming.soon")}</span>
        </div>

        <p className={tradeStyles.note}>{t("trades.coming")}</p>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelHeadLeft}>
              <span className={styles.panelPulse} />
              <span className={styles.panelTitle}>polymarket-mm · sample feed</span>
            </div>
            <span className={styles.panelSub}>
              {t("trades.paper.pnl")} (24h): <span className={styles.pnlPos}>+ $124.83</span>
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
              <span className={`${styles.pnl} ${tr.pnlSign === "pos" ? styles.pnlPos : tr.pnlSign === "neg" ? styles.pnlNeg : ""}`}>
                {tr.pnl}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
