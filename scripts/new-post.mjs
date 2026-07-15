#!/usr/bin/env node
/**
 * Create a stub markdown file in content/blog or content/whitepapers
 * with a filled-in frontmatter and draft: true.
 *
 * Usage:
 *   npm run new:post "The verifier-first protocol"
 *   npm run new:paper "BTC 5-min microstructure follow-up"
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const [, , kindArg, ...titleParts] = process.argv;
const kind = kindArg === "whitepaper" ? "whitepaper" : "blog";
const title = titleParts.join(" ").trim();

if (!title) {
  console.error(`\nUsage: npm run new:${kind === "whitepaper" ? "paper" : "post"} "<title>"\n`);
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
const dir = kind === "whitepaper"
  ? path.join(repoRoot, "content", "whitepapers")
  : path.join(repoRoot, "content", "blog");
const file = path.join(dir, `${slug}.md`);

if (fs.existsSync(file)) {
  console.error(`\nAlready exists: ${path.relative(repoRoot, file)}\n`);
  process.exit(1);
}

fs.mkdirSync(dir, { recursive: true });

const today = new Date().toISOString().slice(0, 10);

const blogFrontmatter = `---
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
`;

const paperFrontmatter = `---
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
`;

fs.writeFileSync(file, kind === "whitepaper" ? paperFrontmatter : blogFrontmatter);

const rel = path.relative(repoRoot, file);
const publishCmd = "git add . && git commit -m \"" + (kind === "whitepaper" ? "paper" : "post") + ": " + title + "\" && git push";

console.log(`
Created ${rel}

  Edit it, write your content, then:
    1. flip 'draft: true' → 'draft: false' in the frontmatter
    2. ${publishCmd}
  Vercel auto-deploys on push. Local preview: npm run dev
`);
