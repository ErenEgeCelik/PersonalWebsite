export type TradeRow = {
  ts: string;
  side: "buy" | "sell";
  ticker: string;
  quote: number;
  entry: number;
  exit: number;
  pnl: number;
};

export type TradesSummary = {
  status: "shadow" | "live" | "paused";
  paperPnl24h: number;
  paperPnlAllTime: number;
  tradesCount24h: number;
  tradesCountAllTime: number;
  winRate: number;
};

export type TradesData = {
  updatedAt: string;
  source: string;
  note?: string;
  summary: TradesSummary;
  recent: TradeRow[];
};

export function formatTs(iso: string): string {
  return iso.slice(11, 19);
}

export function formatPnl(pnl: number): { text: string; sign: "pos" | "neg" | "flat" } {
  if (pnl > 0) return { text: `+ $${pnl.toFixed(2)}`, sign: "pos" };
  if (pnl < 0) return { text: `− $${Math.abs(pnl).toFixed(2)}`, sign: "neg" };
  return { text: "± $0.00", sign: "flat" };
}

export function formatPaperPnl(pnl: number): string {
  const prefix = pnl >= 0 ? "+ $" : "− $";
  return `${prefix}${Math.abs(pnl).toFixed(2)}`;
}
