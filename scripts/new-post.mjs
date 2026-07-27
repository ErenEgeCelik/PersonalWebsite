#!/usr/bin/env node
/**
 * Create a stub markdown file in content/blog, content/whitepapers or
 * content/case-studies with filled-in frontmatter and draft: true.
 *
 * Usage:
 *   npm run new:post  "The verifier-first protocol"
 *   npm run new:paper "BTC 5-min microstructure follow-up"
 *   npm run new:case  "Weather prediction markets"
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const KINDS = {
  blog: { dir: "blog", script: "new:post", commit: "post" },
  whitepaper: { dir: "whitepapers", script: "new:paper", commit: "paper" },
  "case-study": { dir: "case-studies", script: "new:case", commit: "case" },
};

const [, , kindArg, ...titleParts] = process.argv;
const kind = KINDS[kindArg] ? kindArg : "blog";
const cfg = KINDS[kind];
const title = titleParts.join(" ").trim();

if (!title) {
  console.error(`\nUsage: npm run ${cfg.script} "<title>"\n`);
  process.exit(1);
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const slug = slugify(title);
const dir = path.join(repoRoot, "content", cfg.dir);
const file = path.join(dir, `${slug}.md`);

if (fs.existsSync(file)) {
  console.error(`\nAlready exists: ${path.relative(repoRoot, file)}\n`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

const today = new Date().toISOString().slice(0, 10);

const templates = {
  blog: `---
title: "${title}"
slug: "${slug}"
date: "${today}"
summary: ""
tags: []
draft: true
---

Write the post here. Delete this line and start with a lede paragraph.

## Section

Body.
`,

  whitepaper: `---
title: "${title}"
subtitle: ""
slug: "${slug}"
date: "${today}"
status: "Draft"
tags: []
summary: "One or two sentences that appear on the whitepapers index and in the featured card."
draft: true
---

## Abstract

Draft the abstract here.

## 1. Introduction

Body.
`,

  "case-study": `---
title: "${title}"
subtitle: "One line on what the project actually did"
slug: "${slug}"
date: "${today}"
period: "Month – Month 2026"
venue: "Where the work happened, e.g. Polymarket — daily temperature markets"
status: "Case study"
tags: []
summary: "Two or three sentences: what the edge was, what it was worth, and how it ended. This is what a reader sees on the index and in the featured card."
draft: true
---

## Summary

What this was, in a paragraph.

## 1. The instrument

What the market is and why it's tradeable.

## 2. The edge

What you found and how it worked.

## 3. Results

Numbers. Be specific and include the losses.

## 4. What went wrong

The failure modes and what each one taught.

## 5. Honest assessment

What this demonstrates, and what it doesn't.
`,
};

fs.writeFileSync(file, templates[kind]);

const rel = path.relative(repoRoot, file);

console.log(`
Created ${rel}

  Edit it, write your content, then:
    1. flip 'draft: true' → 'draft: false' in the frontmatter
    2. git add . && git commit -m "${cfg.commit}: ${title}" && git push
  Vercel auto-deploys on push. Local preview: npm run dev
`);
