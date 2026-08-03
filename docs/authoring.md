# Writing on this site

How to add and edit content.

> **Site URL / domain.** Everything needing an absolute URL — page
> metadata, `sitemap.xml`, `robots.txt`, the RSS feed — reads `SITE_URL`
> from `src/lib/site.ts`. When a domain is attached in Vercel, change that
> one constant (or set `NEXT_PUBLIC_SITE_URL` in the project's environment
> variables) and everything follows.

## TL;DR

```bash
npm run new:project "Weather derivatives"     # content/work
npm run new:paper   "Binary market making"    # content/whitepapers
npm run new:post    "A short note"            # content/blog

npm run dev            # preview at localhost:3000

# publish: flip draft: true -> false, then
git add . && git commit -m "project: ..." && git push
```

## Directory layout

```
content/
  home.md        # kicker, name, lead paragraph, availability line
  about.md       # About page prose + portrait path
  now.md         # the Now page items
  equity.json    # account-value points for the chart on /work/weather
  work/          # projects — the portfolio
  whitepapers/   # papers, full derivations
  blog/          # notes, shorter and more opinionated
```

**Which one?** A **project** (`work/`) is something you built and ran:
what it was, what it earned, how it failed. A **paper** is research: a
question, a method, a result. A **note** (`blog/`) is one idea, short.

Papers and notes both appear on `/writing` in one chronological list and
both live at `/writing/<slug>` — the two directories only differ in
frontmatter and in the label shown on the page.

## Frontmatter

### Project — `content/work/`

```yaml
---
title: "Weather derivatives, three edges deep"
slug: "weather"
order: 3                       # explicit index order, not by date
kicker: "Live strategy · Polymarket"
year: "2026"                   # right-hand column on the index
period: "April – July 2026"    # Period field in the metadata strip
role: "Independent trader"
stack: "Python, METAR, Bayesian updating"
venue: "Polymarket — daily temperature markets"   # optional
short: "One compressed line — this is what the home page shows."
summary: "The longer line for the Work index and the detail header."
tags: [Bayesian inference, Forecasting]
paper: "/writing/some-paper"   # optional, adds a "Read the paper" button
repo: "https://github.com/..." # optional, adds a "Repository" button
equityChart: true              # optional, renders content/equity.json here
draft: true
---
```

The detail page shows Role / Period / Stack / Venue as a metadata strip,
then the body. Projects with more than five h2/h3 headings get a sticky
contents rail on the right; shorter ones don't.

### Paper — `content/whitepapers/`

```yaml
---
title: "..."
subtitle: ""
slug: "..."
date: "2026-06-17"
status: "Working paper"        # shown in the meta line
tags: []
summary: "Two sentences for the index and the feed."
draft: true
---
```

### Note — `content/blog/`

```yaml
---
title: "..."
slug: "..."
date: "2026-07-01"
summary: "One sentence for the index and the feed."
tags: []
draft: true
---
```

## Body syntax

Standard markdown plus GitHub tables and task lists.

**Math** — KaTeX renders `$$ ... $$` display blocks:

```markdown
$$
\text{fair}_{\text{UP}}(t) = \Phi\!\left(\frac{F(t) - F_0}{\sigma\sqrt{\tau}}\right)
$$
```

Inline single-dollar math is **disabled** so `$54`, `$1,200` and `−$1.64`
render as prose rather than as broken formulas.

**Cross-links** use real paths: `/work/weather`, `/writing/<slug>`.

## Auto-generated

You never set these:

- **Reading time** — from word count.
- **Contents rail** — h2/h3 headings, on documents with more than five.
- **Tag pages** — every tag gets `/tag/<slug>`, listing projects and writing.
- **RSS** — `/feed.xml` picks up papers and notes on the next build.
- **Sitemap** — every route, rebuilt each deploy.

## Editing the front page

`content/home.md`:

```yaml
---
kicker: "İzmir & Ankara, Turkey"
name: "Eren Ege Çelik"
availability: "Looking for a ... internship for summer 2027."
---

The lead paragraph, plain text.
```

Selected work and Writing below it come from `content/`; nothing on the
home page is hand-maintained.

## Publishing checklist

1. `draft: false`
2. `npm run dev` and read it once
3. Commit and push
4. Vercel rebuilds in ~1 minute

To **unpublish**, set `draft: true` — the page 404s and leaves every index.

## Renaming

Change the filename **and** the `slug:` together. If the old URL was
public, add a redirect in `next.config.ts` — that's where the
`/whitepapers/*` → `/writing/*` and `/case-studies/*` → `/work/*`
redirects from the last restructure live.
