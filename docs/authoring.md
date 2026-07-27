# Writing on this site

> **Site URL / domain.** Everything that needs an absolute URL — page
> metadata, `sitemap.xml`, `robots.txt`, the RSS feed — reads from
> `SITE_URL` in `src/lib/site.ts`. When a custom domain is attached in
> Vercel, change that one constant (or set `NEXT_PUBLIC_SITE_URL` in the
> project's environment variables) and everything follows.


How to add and edit content — blog posts and whitepapers.

## TL;DR

```bash
# New blog post
npm run new:post "The verifier-first protocol"

# New whitepaper
npm run new:paper "BTC 5-min microstructure follow-up"

# New case study
npm run new:case "Weather prediction markets"

# Preview locally
npm run dev
# → http://localhost:3000

# Publish
# 1. Edit the file, flip draft: true → false in the frontmatter
# 2. git add . && git commit -m "post: <title>" && git push
# Vercel auto-deploys.
```

## Directory layout

```
content/
  home.md        # the home page opening line + paragraph
  equity.json    # data for the home page equity chart
  case-studies/  # end-to-end project write-ups — the portfolio
  whitepapers/   # working papers, empirical studies
  blog/          # short notes, opinions, method fragments
```

**Which one?** A *case study* is a project: what you built, what it
earned, how it failed, what you'd do differently. A *whitepaper* is
research: a question, a method, a result. A *blog post* is a note —
one idea, short.

### Editing the home page copy

`content/home.md` holds the two pieces of text at the top of the site:

```yaml
---
statement: "Quantitative research on prediction markets."  # big serif line
chartLabel: "The model this site is mostly about"          # "" hides it
---

The supporting paragraph, in markdown. **Bold** and [links](/cv) work.
```

Nothing else on the home page is hand-written — the writing list, the
featured paper and the Building section all come from `content/` and
`src/lib/projects.ts`.

Each entry is a single `.md` file. Filename doubles as the URL slug
(so `verifier-first-protocol.md` → `/blog/verifier-first-protocol`).

## Frontmatter

Every file starts with YAML frontmatter between `---` lines.

### Blog post

```yaml
---
title: "The verifier-first protocol"
slug: "verifier-first-protocol"       # url (matches filename)
date: "2026-06-20"                    # yyyy-mm-dd; used for sort + display
summary: "One sentence used on the index page and RSS feed."
tags: [methodology, markets]          # clickable → /tag/<slug>
draft: true                           # true = hidden from lists + detail
---
```

### Whitepaper

```yaml
---
title: "Microstructure and Efficiency of Polymarket's..."
subtitle: "An empirical reverse-engineering study"
slug: "polymarket-5min-microstructure"
date: "2026-06-17"
status: "Working paper"               # free text: Draft / Working paper / Published
tags: [markets, polymarket, microstructure]
summary: "Two-sentence abstract for the index card and RSS feed."
draft: true
---
```

### Case study

```yaml
---
title: "Weather Prediction Markets: A Succession of Edges"
subtitle: "Building, measuring and retiring a systematic edge"
slug: "weather-prediction-markets"
date: "2026-07-25"                    # sort order only
period: "April – July 2026"           # shown instead of the date
venue: "Polymarket — daily maximum temperature markets, 28 cities"
status: "Case study"
tags: [prediction-markets, polymarket, latency]
summary: "What the edge was, what it was worth, how it ended."
draft: true
---
```

`period` and `venue` are case-study-only. `period` replaces the date
everywhere the entry is listed, because a project spans months rather
than happening on a day.

Everything after the closing `---` is the body — plain markdown.

## Body syntax

Standard markdown + GitHub-flavoured extras (tables, task lists).

**Math** — whitepapers only, KaTeX renders `$$...$$` display blocks:

```markdown
$$
\text{fair}_{\text{UP}}(t) = \Phi\!\left(\frac{F(t) - F_0}{\sigma\sqrt{\tau}}\right)
$$
```

Inline single-dollar math is **disabled** so currency values like
`$54`, `$1,200`, `−$1.64` render as prose, not as broken formulas.

**Code** — backtick and fenced code both work; syntax highlighting
uses the default theme:

    ```python
    fair = norm.cdf((F - F0) / (sigma * math.sqrt(tau)))
    ```

**Cross-links** — link between papers and posts with normal markdown
links using the site's paths:

```markdown
See the [main whitepaper](/whitepapers/polymarket-5min-microstructure)
for the full study.
```

## Auto-generated bits

You do NOT need to set:
- **Reading time** — computed from word count if omitted.
- **Table of contents** — extracted from h2/h3 headings, shown as a
  sticky sidebar on whitepaper pages.
- **Tag pages** — every tag automatically gets `/tag/<slug>`.
- **RSS entry** — appears on `/feed.xml` on next build.

## Publishing checklist

1. `draft: false`
2. Sanity-check locally at `npm run dev`
3. Commit + push
4. Wait ~1 min for Vercel to rebuild
5. Verify at `https://erenege.com/blog/<slug>` (or `/whitepapers/<slug>`)

## Editing existing posts

Just edit the `.md` file. All content lives in `content/` — no
database. Any change becomes a new commit. Same publish flow.

To **unpublish**, set `draft: true` and push — the page 404s and
disappears from all indexes.

## Renaming / moving

Change the filename **and** the `slug:` in frontmatter to match, so
the URL stays predictable. If you rename a published post, its old
URL will 404 — set up a redirect in `next.config.ts` if that's a
problem.
