/**
 * Résumé content, from Eren_Ege_Celik_Resume.docx.
 * Shared by /cv (everything) and /about (education, honors, skills).
 * Keep in step with public/Eren_Ege_Celik_Resume.pdf.
 */

export const education = [
  {
    institution: "Middle East Technical University (ODTÜ)",
    location: "Ankara, Turkey",
    period: "2024 — 2028 (expected)",
    detail: "BSc Physics · Penultimate year 2026–27, on track to graduate June 2028",
  },
  {
    institution: "İzmir Institute of Technology (İYTE)",
    location: "İzmir, Turkey",
    period: "transferred",
    detail: "Physics (transferred to ODTÜ) · GPA 3.6 / 4.0",
  },
];

export const honors = [
  "İzmir Mathematics Olympiad Team — regional team, grades 8–9",
  "Physics Olympiad Team, İzmir Atatürk High School (among Turkey's top 5)",
  "Admitted to İzmir Atatürk High School via nationally competitive exam (top ~0.2%)",
];

export const experience = [
  {
    role: "Independent Quantitative Researcher & Trader",
    context: "Prediction Markets · Self-directed, live trading on Polymarket",
    location: "Remote",
    period: "2026 — present",
    bullets: [
      "Grew a single $30 deposit to ~$1,200 in net P&L over three months of live trading, no additional capital.",
      "Reverse-engineered the dominant market maker on Polymarket's BTC 5-minute contracts — identified its price-feed composition via exclusive falsification testing, achieved ~6-tick out-of-sample replication of its quotes. Documented in a working paper.",
      "Derived a Brownian-probit fair-value model and a binary-CARA inventory-skew rule from first principles; validated against logged data (within-slot R² ≈ 0.92).",
      "Formalized the strategy as a Markov Decision Process to stress-test its structural limits, isolating queue-priority inaccessibility (not model quality) as the binding constraint on profitability — an honest negative result documented for rigor.",
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
    label: "Quantitative",
    items: [
      "Probability & statistics",
      "Bayesian inference",
      "Stochastic modelling",
      "Time-series analysis",
      "Market microstructure",
      "Derivatives pricing",
    ],
  },
  {
    label: "Technical",
    items: [
      "Python (pandas, NumPy)",
      "C#",
      "Low-latency WebSocket systems",
      "CLOB / REST APIs",
      "Polygon / USDC / DeFi tooling",
      "Multi-agent coding workflows",
    ],
  },
];

/** Prose form, for the CV page's skills block. */
export const skillsProse = {
  Quantitative:
    "probability & statistics, Bayesian inference, stochastic modeling, time-series analysis, market microstructure, derivatives pricing",
  Technical:
    "Python (pandas, NumPy), C#, low-latency WebSocket data systems, CLOB / REST APIs, Polygon / USDC / DeFi tooling, multi-agent coding workflows",
};

export const RESUME_PDF = "/Eren_Ege_Celik_Resume.pdf";
