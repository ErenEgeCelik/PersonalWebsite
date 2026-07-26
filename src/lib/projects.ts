export type ProjectStatus = "live" | "draft" | "idle";

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
    title: "Crypto-bot",
    period: "2026 — present",
    since: 2026.2,
    status: "live",
    statusLabel: "live",
    desc: "Shadow market-making on Polymarket's BTC/ETH 5-minute binary markets. Brownian-probit fair value, inventory-aware skew under CARA utility, and low-latency multi-venue feeds (Binance, Coinbase, Kraken, Bitstamp, Chainlink relay) deployed on AWS Ireland.",
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
