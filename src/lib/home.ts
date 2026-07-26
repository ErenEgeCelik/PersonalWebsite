import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type HomeCopy = {
  /** Large serif opening line. */
  statement: string;
  /** Mono label shown above the hero chart; empty string hides it. */
  chartLabel: string;
  /** Supporting paragraph, markdown. */
  body: string;
};

const FILE = path.join(process.cwd(), "content", "home.md");

const FALLBACK: HomeCopy = {
  statement: "Quantitative research on prediction markets.",
  chartLabel: "",
  body: "",
};

/** Hero copy lives in content/home.md so it can be edited without touching JSX. */
export function getHomeCopy(): HomeCopy {
  if (!fs.existsSync(FILE)) return FALLBACK;
  const { data, content } = matter(fs.readFileSync(FILE, "utf8"));
  return {
    statement: (data.statement as string) || FALLBACK.statement,
    chartLabel: typeof data.chartLabel === "string" ? data.chartLabel : "",
    body: content.trim(),
  };
}
