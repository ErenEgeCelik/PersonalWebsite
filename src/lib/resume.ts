/**
 * CV content, from Eren_Ege_Celik_CV_PredictionMarkets_v2.docx (2026-08-07).
 * Shared by /cv (everything) and /about (education, honors, skills).
 * Keep in step with public/Eren_Ege_Celik_CV.pdf, which is generated from
 * that same .docx — if you edit one, regenerate the other.
 *
 * Claim wording here is governed by the evidence ledger. Before changing a
 * number, read docs/content-audit-2026-08-07.md; several figures on this
 * page were previously wrong in ways that were not obvious.
 */

/** The CV's header summary. */
export const summary =
  "Independent quantitative researcher and prediction-markets trader. I formalize market mechanics as finite-state decision problems, derive expected value from observable transitions, and test policies with placebos, chronological out-of-sample evaluation and clustered uncertainty. Built Bayesian fair-value, latency-aware CLOB execution and microstructure research systems; traded small self-funded capital on Polymarket since 2026.";

export const education = [
  {
    institution: "Middle East Technical University (ODTÜ)",
    location: "Ankara, Turkey",
    period: "2025 — Jun 2028",
    detail: "BSc Physics · Penultimate year 2026–27, on track to graduate June 2028",
  },
  {
    institution: "İzmir Institute of Technology (İYTE)",
    location: "İzmir, Turkey",
    period: "2024 — 2025",
    detail: "Physics · GPA 3.6 / 4.0 · transferred to ODTÜ",
  },
  {
    institution: "İzmir Atatürk High School",
    location: "İzmir, Turkey",
    period: "2020 — 2024",
    detail: "Entered by national examination, top 0.7% nationally",
  },
];

export const honors = [
  "Physics Olympiad Team, İzmir Atatürk High School — final year",
  "İzmir Mathematics Olympiad Team — selected in grade 8, the candidate pool for the national team",
  "İzmir Atatürk High School is among Turkey's five highest-scoring high schools by entrance rank",
];

export const experience = [
  {
    role: "Independent Quantitative Researcher & Trader",
    context: "Prediction Markets · Self-directed, live trading on Polymarket",
    location: "Remote",
    period: "2026 — present",
    bullets: [
      "Built and operated a 24/7 research and execution stack on small self-funded capital, spanning probabilistic fair value, event-driven triggers, CLOB execution, replay, and live and paper verification.",
      "Grew a self-funded Polymarket account from roughly $30 to roughly $1,200 over three months of live trading, with no further deposits.",
    ],
    groups: [
      {
        label: "Weather fair value",
        context: "Bayesian state space, Monte Carlo, calibration",
        bullets: [
          "Built a fair-value engine for daily-temperature markets across ~28 cities: a scalar Kalman posterior over the true airport temperature, a Monte Carlo daily-maximum distribution, and a production-checked consistency identity linking the current, next-observation and conditional outcome distributions.",
          "Rebuilt the leakage-aware calibration pipeline; in offline replay it reduced mean Brier score by 24.2% against the prior model configuration across 28 market fits, with no fit regressing. The final calibration was never deployed.",
        ],
      },
      {
        label: "Latency-aware execution and model retirement",
        context: "Pre-signing, caching, replay",
        bullets: [
          "Built a pre-signed EIP-712 order path with warm CLOB sessions, cached market state, keep-alive and multi-VPS routing; cut measured trigger-to-order latency from 10.2 s to ~58 ms, and measured one national feed running 4 min 44 s ahead of the reference source.",
          "Defined state, actions, transitions and reward explicitly; compared hold-to-resolution against exit-at-next-event policies under mean-variance utility and liquidity-aware exit assumptions.",
          "Retired the weather strategy after an out-of-sample replay over 3.3 GB, 50 city-days and 32 settlement events found −$0.58 expected value per $1 across every entry band. The median repricing window had compressed from 23 s to 0.15 s.",
        ],
      },
      {
        label: "BTC 5-minute market microstructure",
        context: "Brownian-probit, verifier-first research",
        bullets: [
          "Reverse-engineered the dominant maker's Brownian-probit quote schedule to a ~0.92 median within-slot R² and ~6-tick chronological out-of-sample quote RMSE. The market's own prices calibrated outcomes better, so the model is structural replication rather than alpha.",
          "Defined an MDP-style state/action/transition tree and tested policies with placebo controls, chronological out-of-sample splits, slot-cluster bootstrap and feed-dropout cleaning. Fresh out-of-sample data rejected the static maker front at −0.98 cents per eligible quote moment, 90% CI [−1.63, −0.36].",
          "Measured simulator coverage directly: the same six crash slots replayed at +$21 while the contemporaneous paper arm lost $31. Positive tape results were treated as upper bounds and live-probe targets, never as deployment evidence.",
        ],
      },
      {
        label: "World Cup cross-market relative value",
        context: "Conditional goal model",
        bullets: [
          "Built a conditional goal-arrival model and a precomputed trigger table; verified it against full simulation to a maximum divergence of 0.0028 and against live prices to within 0.02 before sizing small real-money positions.",
        ],
      },
    ],
  },
  {
    role: "Undergraduate Research Assistant (volunteer)",
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

export const research = [
  {
    title: "Reverse-Engineering a Prediction Market Maker",
    detail:
      "Feed identification, volatility dynamics, and out-of-sample replication evidence from Polymarket BTC contracts.",
    href: "/writing/polymarket-5min-microstructure",
  },
  {
    title: "Binary Market Making",
    detail:
      "Inventory-skew derivation under CARA utility, adverse-selection analysis, and empirical verdicts under realistic execution.",
    href: null,
  },
];

export const activities = [
  "Organizing Staff — International Conference on Superconductivity and Magnetism (ICSM) & ICSQMT, 2025 & 2026",
];

export const skillGroups = [
  {
    label: "Programming",
    items: ["Python", "NumPy / pandas", "asyncio", "matplotlib", "Linux", "Git", "Playwright", "C#"],
  },
  {
    label: "Methods",
    items: [
      "Bayesian state-space models",
      "Markov decision processes",
      "Monte Carlo",
      "Ordered probit",
      "Brier calibration",
      "Chronological OOS",
      "Placebo tests",
      "Clustered bootstrap",
    ],
  },
  {
    label: "Markets",
    items: [
      "CLOB mechanics",
      "Order-book microstructure",
      "Polymarket",
      "Polygon / USDC execution",
      "EIP-712 order signing",
      "WebSocket & REST feeds",
    ],
  },
  {
    label: "Infrastructure",
    items: ["AWS", "Multi-region deployment", "VPS operations", "Tailscale mesh"],
  },
];

/** Prose form, for the CV page's skills block. */
export const skillsProse = {
  Programming: "Python (NumPy, pandas, asyncio, matplotlib), Linux, Git, Playwright, C# (2023)",
  Methods:
    "Bayesian state-space models, MDPs, Monte Carlo, ordered probit, Brier calibration, chronological out-of-sample evaluation, placebo tests, clustered bootstrap",
  Markets:
    "CLOB mechanics, order-book microstructure, Polymarket, Polygon and USDC execution, EIP-712 order signing, WebSocket and REST feeds",
  Infrastructure: "AWS, multi-region deployment, VPS operations, Tailscale mesh",
};

export const interests =
  "Football — Göztepe academy U14–U15, school team captain in middle and high school. Competitive Valorant (Immortal, team tournaments). Chess.";

export const RESUME_PDF = "/Eren_Ege_Celik_CV.pdf";
