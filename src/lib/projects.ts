export type ProjectStatus = "live" | "draft" | "idle" | "retired";

export type Project = {
  title: string;
  /** Display period, e.g. "2026 — present" */
  period: string;
  /** Sort key — newest first */
  since: number;
  status: ProjectStatus;
  statusLabel: string;
  desc: string;
  links?: { label: string; href: string; external?: boolean }[];
  /** Shown instead of a link when there's nothing public to point at yet */
  note?: string;
};

const GH = "https://github.com/ErenEgeCelik";

/**
 * Portfolio entries. The working code stays private; each project has a
 * public companion repo holding the write-up and a small self-contained
 * reference implementation. See docs/github-repos.md for what goes in them.
 */
export const projects: Project[] = [
  {
    title: "Weather prediction markets",
    period: "Apr – Jul 2026",
    since: 2026.5,
    status: "retired",
    statusLabel: "measured, retired",
    desc: "Polymarket's daily maximum-temperature markets across 28 cities. Three successive edges — observation latency from a state meteorological feed, the redistribution of a dying bucket as a Markov decision problem, and the forecast itself. A five-machine data infrastructure, a Kalman-filter probability engine, and an out-of-sample EV measurement on 3.3 GB of tick data that killed the strategy rather than confirming it.",
    links: [
      { label: "Read the case study", href: "/case-studies/weather-prediction-markets" },
    ],
  },
  {
    title: "World Cup group markets",
    period: "Jun 2026",
    since: 2026.4,
    status: "retired",
    statusLabel: "tournament over",
    desc: "A match's moneyline market reprices in milliseconds; the dependent group markets take minutes. A Monte Carlo standings model translates one into the other, validated against live prices to ±0.02 before sizing. Roughly +$16 net over four matches with real money, and four failure modes diagnosed with money on the line.",
    links: [
      { label: "Read the case study", href: "/case-studies/world-cup-group-markets" },
    ],
  },
  {
    title: "Crypto-bot",
    period: "2026 — present",
    since: 2026.2,
    status: "live",
    statusLabel: "live",
    desc: "Shadow market-making on Polymarket's BTC/ETH 5-minute binary markets. Brownian-probit fair value, inventory-aware skew under CARA utility, and low-latency multi-venue feeds deployed on AWS Ireland.",
    links: [
      { label: "Read the paper", href: "/whitepapers/polymarket-5min-microstructure" },
      { label: "GitHub", href: `${GH}/polymarket-microstructure`, external: true },
    ],
  },
  {
    title: "Binary Market Making",
    period: "2026",
    since: 2026.1,
    status: "draft",
    statusLabel: "in preparation",
    desc: "Inventory-skew derivation under CARA utility, adverse-selection analysis, and empirical verdicts under realistic execution costs. The binding constraint turned out to be queue-priority inaccessibility, not model quality.",
    links: [{ label: "GitHub", href: `${GH}/binary-market-making`, external: true }],
    note: "paper in preparation",
  },
  {
    title: "Reversible SAT",
    period: "2024 — present",
    since: 2024,
    status: "idle",
    statusLabel: "draft",
    desc: "Reversible-logic SAT circuits and what they imply for cryptographic primitives — an information-theoretic angle on computational complexity.",
    links: [{ label: "GitHub", href: `${GH}/reversible-sat`, external: true }],
    note: "early draft",
  },
];

export function getProjects(): Project[] {
  return [...projects].sort((a, b) => b.since - a.since);
}
