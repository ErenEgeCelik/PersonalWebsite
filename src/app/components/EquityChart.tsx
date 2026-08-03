import styles from "./EquityChart.module.css";
import type { EquitySeries } from "@/lib/equity";

const W = 720;
const H = 300;
const PAD = { l: 8, r: 8, t: 26, b: 34 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;

function money(v: number, currency: string): string {
  const symbol = currency === "USD" ? "$" : "";
  return `${symbol}${Math.round(v).toLocaleString("en-US")}`;
}

function monthLabel(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" });
}

/**
 * Catmull-Rom through the checkpoints, converted to cubic béziers.
 * Smooths the line between real points without inventing peaks between them.
 */
function smoothPath(pts: { x: number; y: number }[]): string {
  if (pts.length < 2) return "";
  let d = `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(
      2,
    )}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

export default function EquityChart({ series }: { series: EquitySeries }) {
  const { points, currency, note, label } = series;


  const values = points.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  // Headroom so the peak doesn't touch the top edge.
  const lo = min - span * 0.08;
  const hi = max + span * 0.14;

  const t0 = new Date(`${points[0].date}T00:00:00Z`).getTime();
  const t1 = new Date(`${points[points.length - 1].date}T00:00:00Z`).getTime();
  const tSpan = t1 - t0 || 1;

  const xy = points.map((p) => ({
    x: PAD.l + ((new Date(`${p.date}T00:00:00Z`).getTime() - t0) / tSpan) * PLOT_W,
    y: PAD.t + (1 - (p.value - lo) / (hi - lo)) * PLOT_H,
  }));

  const line = smoothPath(xy);
  const area = `${line} L${xy[xy.length - 1].x.toFixed(2)} ${(PAD.t + PLOT_H).toFixed(
    2,
  )} L${xy[0].x.toFixed(2)} ${(PAD.t + PLOT_H).toFixed(2)} Z`;

  const first = points[0];
  const last = points[points.length - 1];
  const end = xy[xy.length - 1];

  return (
    <figure className={styles.figure}>
      <p className={styles.label}>{label}</p>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`${label}: ${money(first.value, currency)} on ${first.date} rising to ${money(
          last.value,
          currency,
        )} on ${last.date}.`}
      >
        <defs>
          <linearGradient id="equityFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent-warm)" stopOpacity="0.30" />
            <stop offset="55%" stopColor="var(--accent-warm)" stopOpacity="0.09" />
            <stop offset="100%" stopColor="var(--accent-warm)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="equityStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--accent-warm)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent-warm-bright)" stopOpacity="1" />
          </linearGradient>
        </defs>

        <line
          x1={PAD.l}
          x2={W - PAD.r}
          y1={PAD.t + PLOT_H}
          y2={PAD.t + PLOT_H}
          className={styles.baseline}
        />

        <path d={area} fill="url(#equityFill)" className={styles.area} />
        <path d={line} className={styles.line} />

        <circle cx={end.x} cy={end.y} r="4" className={styles.endDot} />

        <text x={PAD.l} y={PAD.t + PLOT_H + 22} className={styles.axis}>
          {monthLabel(first.date)}
        </text>
        <text x={W - PAD.r} y={PAD.t + PLOT_H + 22} className={styles.axisEnd}>
          {monthLabel(last.date)}
        </text>
      </svg>

      <div className={styles.readout}>
        <div className={styles.jump}>
          <span className={styles.from}>{money(first.value, currency)}</span>
          <span className={styles.arrow}>→</span>
          <span className={styles.to}>{money(last.value, currency)}</span>
        </div>
        {note && <p className={styles.note}>{note}</p>}
      </div>
    </figure>
  );
}
