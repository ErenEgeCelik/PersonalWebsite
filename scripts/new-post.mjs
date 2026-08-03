#!/usr/bin/env node
/**
 * Create a stub markdown file with filled-in frontmatter and draft: true.
 *
 * Usage:
 *   npm run new:post    "The verifier-first protocol"   -> content/blog
 *   npm run new:paper   "Binary market making"          -> content/whitepapers
 *   npm run new:project "Weather derivatives"           -> content/work
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const KINDS = {
  blog: { dir: "blog", script: "new:post", commit: "post" },
  whitepaper: { dir: "whitepapers", script: "new:paper", commit: "paper" },
  work: { dir: "work", script: "new:project", commit: "project" },
};

const [, , kindArg, ...titleParts] = process.argv;
const kind = KINDS[kindArg] ? kindArg : "blog";
const cfg = KINDS[kind];
const title = titleParts.join(" ").trim();

if (!title) {
  console.error(`\nUsage: npm run ${cfg.script} "<title>"\n`);
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^\w\s-]/g, "")
  .trim()
  .replace(/\s+/g, "-");

const dir = path.join(repoRoot, "content", cfg.dir);
const file = path.join(dir, `${slug}.md`);

if (fs.existsSync(file)) {
  console.error(`\nAlready exists: ${path.relative(repoRoot, file)}\n`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

const today = new Date().toISOString().slice(0, 10);
const year = today.slice(0, 4);

const templates = {
  blog: `---
title: "${title}"
slug: "${slug}"
date: "${today}"
summary: "One sentence for the Writing index and the RSS feed."
tags: []
draft: true
---

Open with the point, not a preamble.

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
summary: "Two sentences: the question and the result."
draft: true
---

## Abstract

Draft the abstract here.

## 1. Introduction

Body.
`,

  work: `---
title: "${title}"
slug: "${slug}"
order: 9
kicker: "Research · Venue"
year: "${year}"
period: "Month – Month ${year}"
role: "Independent researcher"
stack: "Python, ..."
short: "One compressed line — this is what shows on the home page."
summary: "The longer line for the Work index and the top of the detail page."
tags: []
draft: true
---

## The question

What you were trying to find out.

## Method

How you went about it.

## Result

What happened. Include the numbers and the failures.
`,
};

fs.writeFileSync(file, templates[kind]);

console.log(`
Created ${path.relative(repoRoot, file)}

  Edit it, then:
    1. flip 'draft: true' -> 'draft: false'
    2. git add . && git commit -m "${cfg.commit}: ${title}" && git push
  Vercel auto-deploys on push. Local preview: npm run dev
`);
