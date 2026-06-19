import styles from "../page.module.css";
import tradeStyles from "./trades.module.css";
import { formatTs, formatPnl, formatPaperPnl } from "@/lib/trades";
import { getTrades } from "@/lib/trades.server";

export default function TradesPage() {
  const data = getTrades();

  if (!data) {
    return (
      <main className={styles.main}>
        <p style={{ color: "var(--text-muted)" }}>No trade data available.</p>
      </main>
    );
  }

  const updated = new Date(data.updatedAt);
  const updatedFmt = updated.toISOString().replace("T", " ").slice(0, 19) + " UTC";

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Trades</h2>
          <span className={tradeStyles.updatedAt}>
            updated <span className={tradeStyles.mono}>{updatedFmt}</span>
          </span>
        </div>

        <div className={tradeStyles.statsGrid}>
          <div className={tradeStyles.stat}>
            <div className={tradeStyles.statLabel}>Status</div>
            <div className={`${tradeStyles.statValue} ${tradeStyles.mono}`}>
              <span className={tradeStyles.statDot} data-status={data.summary.status} />
              {data.summary.status}
            </div>
          </div>
          <div className={tradeStyles.stat}>
            <div className={tradeStyles.statLabel}>Paper PnL (24h)</div>
            <div className={`${tradeStyles.statValue} ${tradeStyles.mono} ${data.summary.paperPnl24h >= 0 ? tradeStyles.pos : tradeStyles.neg}`}>
              {formatPaperPnl(data.summary.paperPnl24h)}
            </div>
          </div>
          <div className={tradeStyles.stat}>
            <div className={tradeStyles.statLabel}>Paper PnL (all-time)</div>
            <div className={`${tradeStyles.statValue} ${tradeStyles.mono} ${data.summary.paperPnlAllTime >= 0 ? tradeStyles.pos : tradeStyles.neg}`}>
              {formatPaperPnl(data.summary.paperPnlAllTime)}
            </div>
          </div>
          <div className={tradeStyles.stat}>
            <div className={tradeStyles.statLabel}>Win rate</div>
            <div className={`${tradeStyles.statValue} ${tradeStyles.mono}`}>
              {(data.summary.winRate * 100).toFixed(1)}%
            </div>
          </div>
          <div className={tradeStyles.stat}>
            <div className={tradeStyles.statLabel}>Trades (24h)</div>
            <div className={`${tradeStyles.statValue} ${tradeStyles.mono}`}>{data.summary.tradesCount24h}</div>
          </div>
          <div className={tradeStyles.stat}>
            <div className={tradeStyles.statLabel}>Trades (all-time)</div>
            <div className={`${tradeStyles.statValue} ${tradeStyles.mono}`}>
              {data.summary.tradesCountAllTime.toLocaleString()}
            </div>
          </div>
        </div>

        {data.note && (
          <p className={tradeStyles.note}>{data.note}</p>
        )}

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={styles.panelHeadLeft}>
              <span className={styles.panelPulse} />
              <span className={styles.panelTitle}>polymarket-mm · recent</span>
            </div>
            <span className={styles.panelSub}>
              source: <span className={tradeStyles.mono}>{data.source}</span>
            </span>
          </div>
          {data.recent.map((tr) => {
            const pnl = formatPnl(tr.pnl);
            return (
              <div key={tr.ts} className={styles.tradeRow}>
                <span className={styles.ts}>{formatTs(tr.ts)}</span>
                <span className={`${styles.side} ${tr.side === "buy" ? styles.sideBuy : styles.sideSell}`}>
                  {tr.side.toUpperCase()}
                </span>
                <span className={styles.ticker}>{tr.ticker}</span>
                <span className={styles.tradeDetail}>
                  q={tr.quote.toFixed(2)} · ${tr.entry.toFixed(2)} → ${tr.exit.toFixed(2)}
                </span>
                <span className={`${styles.pnl} ${pnl.sign === "pos" ? styles.pnlPos : pnl.sign === "neg" ? styles.pnlNeg : ""}`}>
                  {pnl.text}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
