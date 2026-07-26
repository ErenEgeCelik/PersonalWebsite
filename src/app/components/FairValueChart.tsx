import styles from "./FairValueChart.module.css";

/**
 * The Brownian-probit fair value from the microstructure paper:
 *
 *   fair_UP(t) = Φ( (F − F₀) / (σ√τ) )
 *
 * Drawn for a family of times-to-expiry. As τ → 0 the curve collapses
 * from a gentle sigmoid toward a step — which is the whole story of a
 * 5-minute binary market in one picture.
 *
 * Server-rendered SVG: no client JS, no external assets.
 */

/** Zelen & Severo approximation to the standard normal CDF. */
function normCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989422804014327 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

const TAUS = [300, 190, 120, 70, 38, 17, 6]; // seconds to expiry
const SIGMA = 3.4; // ticks per √s — the paper's baseline
const XMIN = -70;
const XMAX = 70;

const W = 680;
const H = 252;
const PAD = { l: 54, r: 16, t: 18, b: 36 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;

const sx = (v: number) => PAD.l + ((v - XMIN) / (XMAX - XMIN)) * PLOT_W;
const sy = (p: number) => PAD.t + (1 - p) * PLOT_H;

function curvePath(tau: number): string {
  const denom = SIGMA * Math.sqrt(tau);
  const pts: string[] = [];
  for (let i = 0; i <= 140; i++) {
    const v = XMIN + ((XMAX - XMIN) * i) / 140;
    const p = normCdf(v / denom);
    pts.push(`${i === 0 ? "M" : "L"}${sx(v).toFixed(2)} ${sy(p).toFixed(2)}`);
  }
  return pts.join(" ");
}

const curves = TAUS.map((tau, i) => ({
  tau,
  d: curvePath(tau),
  // Later curves (closer to expiry) are brighter — the eye follows time.
  opacity: 0.22 + (i / (TAUS.length - 1)) * 0.78,
  lead: i === TAUS.length - 1,
}));

const xTicks = [-60, -30, 0, 30, 60];
const yTicks = [0, 0.5, 1];

export default function FairValueChart() {
  return (
    <figure className={styles.figure}>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label="Brownian-probit fair value curves for a 5-minute binary market, drawn for times to expiry from 300 seconds down to 6 seconds. As expiry approaches the curve steepens from a gentle sigmoid toward a step function."
      >
        {/* horizontal grid */}
        {yTicks.map((p) => (
          <line
            key={`gy${p}`}
            x1={PAD.l}
            x2={W - PAD.r}
            y1={sy(p)}
            y2={sy(p)}
            className={p === 0.5 ? styles.gridMid : styles.grid}
          />
        ))}

        {/* vertical grid */}
        {xTicks.map((v) => (
          <line
            key={`gx${v}`}
            x1={sx(v)}
            x2={sx(v)}
            y1={PAD.t}
            y2={PAD.t + PLOT_H}
            className={v === 0 ? styles.gridMid : styles.grid}
          />
        ))}

        {/* the curve family */}
        {curves.map((c, i) => (
          <path
            key={c.tau}
            d={c.d}
            className={`${styles.curve} ${c.lead ? styles.curveLead : ""}`}
            style={{ opacity: c.opacity, animationDelay: `${i * 0.13}s` }}
          />
        ))}

        {/* the point every quote hangs off: fair = 0.5 at F = F₀ */}
        <circle cx={sx(0)} cy={sy(0.5)} r="3.5" className={styles.pivot} />

        {/* y labels */}
        {yTicks.map((p) => (
          <text key={`ty${p}`} x={PAD.l - 12} y={sy(p) + 3.5} className={styles.tickY}>
            {p.toFixed(1)}
          </text>
        ))}

        {/* x labels */}
        {xTicks.map((v) => (
          <text key={`tx${v}`} x={sx(v)} y={PAD.t + PLOT_H + 20} className={styles.tickX}>
            {v > 0 ? `+${v}` : v}
          </text>
        ))}

        <text x={PAD.l - 12} y={PAD.t - 6} className={styles.axisLabel}>
          P(UP)
        </text>
        <text x={W - PAD.r} y={H - 4} className={styles.axisLabelEnd}>
          F − F₀ (ticks)
        </text>
      </svg>

      <figcaption className={styles.caption}>
        <span className={styles.captionFormula}>
          fair<sub>UP</sub> = Φ((F − F₀) / σ√τ)
        </span>
        <span className={styles.captionSep}>·</span>
        <span>τ = 300 s → 6 s to expiry</span>
      </figcaption>
    </figure>
  );
}
