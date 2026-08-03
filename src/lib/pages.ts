import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

function read(name: string) {
  const file = path.join(process.cwd(), "content", name);
  if (!fs.existsSync(file)) return null;
  return matter(fs.readFileSync(file, "utf8"));
}

export type AboutCopy = {
  portrait: string;
  portraitAlt: string;
  body: string;
};

export function getAbout(): AboutCopy {
  const f = read("about.md");
  return {
    portrait: (f?.data.portrait as string) || "",
    portraitAlt: (f?.data.portraitAlt as string) || "Eren Ege Çelik",
    body: f?.content.trim() ?? "",
  };
}

export type NowItem = { title: string; body: string };
export type NowCopy = { updated: string; items: NowItem[] };

export function getNow(): NowCopy {
  const f = read("now.md");
  return {
    updated: (f?.data.updated as string) || "",
    items: ((f?.data.items as NowItem[]) || []).filter((i) => i && i.title),
  };
}
