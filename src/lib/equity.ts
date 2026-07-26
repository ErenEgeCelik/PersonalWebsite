import "server-only";
import fs from "node:fs";
import path from "node:path";

export type EquityPoint = { date: string; value: number };

export type EquitySeries = {
  label: string;
  note: string;
  currency: string;
  points: EquityPoint[];
};

const FILE = path.join(process.cwd(), "content", "equity.json");

/**
 * Account-value checkpoints for the home page chart.
 *
 * Returns null when there is nothing real to draw. The chart is never
 * rendered from placeholder or interpolated-from-nothing data — publishing
 * an invented equity curve would be the same mistake as the old
 * trades.json placeholder.
 */
export function getEquitySeries(): EquitySeries | null {
  if (!fs.existsSync(FILE)) return null;

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch {
    return null;
  }

  const data = raw as Partial<EquitySeries>;
  const points = (data.points ?? [])
    .filter((p) => p && typeof p.date === "string" && Number.isFinite(p.value))
    .sort((a, b) => (a.date < b.date ? -1 : 1));

  // Two points is a line, not a curve — require enough to be meaningful.
  if (points.length < 3) return null;

  return {
    label: data.label ?? "Account value",
    note: data.note ?? "",
    currency: data.currency ?? "USD",
    points,
  };
}
