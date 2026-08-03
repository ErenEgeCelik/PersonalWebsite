import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type HomeCopy = {
  kicker: string;
  name: string;
  /** Hero lead paragraph, plain text. */
  lead: string;
  /** Availability line; empty string hides it. */
  availability: string;
};

const FILE = path.join(process.cwd(), "content", "home.md");

const FALLBACK: HomeCopy = {
  kicker: "İzmir & Ankara, Turkey",
  name: "Eren Ege Çelik",
  lead: "Physics undergraduate at METU.",
  availability: "",
};

/** Hero copy lives in content/home.md so it can be edited without touching JSX. */
export function getHomeCopy(): HomeCopy {
  if (!fs.existsSync(FILE)) return FALLBACK;
  const { data, content } = matter(fs.readFileSync(FILE, "utf8"));
  return {
    kicker: (data.kicker as string) ?? FALLBACK.kicker,
    name: (data.name as string) || FALLBACK.name,
    lead: content.trim().replace(/\s*\n\s*/g, " ") || FALLBACK.lead,
    availability: typeof data.availability === "string" ? data.availability : "",
  };
}
