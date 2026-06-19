import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { TradesData } from "./trades";

const FILE = path.join(process.cwd(), "public", "data", "trades.json");

export function getTrades(): TradesData | null {
  if (!fs.existsSync(FILE)) return null;
  try {
    const raw = fs.readFileSync(FILE, "utf8");
    return JSON.parse(raw) as TradesData;
  } catch {
    return null;
  }
}
