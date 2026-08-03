# Handoff: Personal site — Eren Ege Çelik

## Overview
A personal portfolio + blog for a physics undergraduate (METU) working on quantitative
trading research for prediction markets. Primary audience: recruiters and hiring managers
for quant research / trading internships. Eight views in one single-page app: Home, Work
(projects index), Project detail, Writing (blog index), Post detail, About, Now, Contact.

The design already exists as a working HTML prototype. The user has a separate site
scaffold previously generated with Claude Code and wants THIS design to replace its
front end. Domain purchase / deploy is still outstanding.

## About the Design Files
The files in this bundle are **design references created in HTML** — a prototype showing
intended look, copy, and navigation behavior. They are NOT production code to copy
verbatim: the prototype is built on a bespoke streaming template runtime
(`support.js`, `<x-dc>`, `<sc-for>`, `<sc-if>`) that should not be carried into the
real codebase.

The task is to **recreate these designs in the target codebase's existing environment**
using its established patterns. If the existing Claude Code scaffold is Next.js /
Astro / plain React, rebuild the views there. If no environment exists yet, choose one —
**Astro or Next.js with MDX** is the natural fit, because the two content types
(projects, posts) are file-backed and the site is otherwise static.

Read the prototype as: markup structure + exact inline style values + exact copy.
Everything visual is inline-styled on purpose; convert to whatever the codebase uses
(CSS modules, Tailwind, styled-components) preserving the values below.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, copy and interaction states.
Recreate pixel-accurately using the design tokens listed below. The one deliberately
unfinished element is the About portrait (an empty drop slot — see Assets).

## Design system
The design is built on **Nocturne**, a dark low-chroma design system. Its single
stylesheet is bundled at `_ds/styles.css` and is the source of truth for tokens. Port the
`:root` token block and the component classes actually used (`.btn`, `.tag`, `.table`,
`.lighten`) rather than re-deriving values.

Direction rules that matter when extending the site:
- Left-aligned, asymmetric layout; content hugs the left, whitespace on the right.
- Primary buttons are **outlined** (1px accent border on transparent), never solid fills.
- Horizontal rules **fade to transparent** at both ends over 48px — never a clean stop.
  Implementation used site-wide:
  `background: linear-gradient(to right, transparent, var(--color-divider) 48px, var(--color-divider) calc(100% - 48px), transparent)`
  on a 1px-tall div.
- Never flood large areas with the accent. Accent is a line, a mark, a glow.
- Photographs go through `.lighten` (`mix-blend-mode: lighten`) and should be shot on
  dark/black backgrounds so the background falls away into the page.
- Don't bolden headings past weight 500 — hierarchy is size and space.
- Icons, if added: Phosphor (https://phosphoricons.com).

## Design Tokens

### Color
| Token | Value | Use |
| --- | --- | --- |
| `--color-bg` | `#161826` | page ground, all views |
| `--color-surface` | `#232532` | cards (not used in this design) |
| `--color-text` | `#e9e9ed` | body + headings |
| `--color-accent` | `#9184d9` | kickers, links, active nav, Now timeline mark |
| `--color-accent-300` | `#d2cefd` | link hover; accent text at paragraph size |
| `--color-divider` | `color-mix(in srgb, #e9e9ed 16%, transparent)` | all row rules |
| `--color-section` | `#262a60` | deck/banner grounds only — unused here |

Neutral ramp: 100 `#f3f5fe`, 200 `#e4e7f5`, 300 `#cfd3e5`, 400 `#b2b6ca`, 500 `#9397ab`,
600 `#75798c`, 700 `#595d6c`, 800 `#3f424d`, 900 `#292b31`.
Accent ramp: 100 `#f5f4ff`, 200 `#e7e5fe`, 300 `#d2cefd`, 400 `#b5abfc`, 500 `#968ae0`,
600 `#796cbf`, 700 `#5d5294`, 800 `#423a6a`, 900 `#2b2741`.

**Text opacity convention.** The design derives muted text from `--color-text` rather than
the ramp, via `color-mix(in srgb, var(--color-text) N%, transparent)`. The N values in use
are meaningful and should be preserved:
- 82% — hero lead paragraph
- 80% — post body paragraphs, About lead
- 78% — project detail summary
- 76% — About body, Contact lead, skills list
- 72% — About secondary paragraphs
- 70% — Work / Writing index intros
- 68% — inactive nav links, Now item bodies
- 65% / 62% — project + post list summaries
- 60% — uppercase section labels
- 55% — small captions
- 45% — dates, metadata, field labels
- 42% — footer

### Type
Inter, weights 400 and 500 only (`--font-heading` = `--font-body` = Inter; heading weight 500).
Loaded from Google Fonts. Body base 15px / 1.55.

| Role | Size | Line-height | Tracking |
| --- | --- | --- | --- |
| Home h1 | 56px | 1.05 | -0.03em |
| Page h1 (Work, Writing, About, Now, Contact) | 44px | default | -0.03em |
| Project detail h1 | 40px | 1.1 | -0.03em |
| Post detail h1 | 38px | 1.12 | -0.03em |
| Hero lead | 19px | 1.6 | — |
| Page intro | 17–18px | 1.65–1.75 | — |
| Post body paragraph | 17px | 1.8 | — |
| Project section h2 | 22px | — | -0.02em |
| Project list title | 21px | — | -0.015em |
| Post list title | 20px | — | -0.015em |
| Home featured title | 19px | — | -0.01em |
| Now item title | 18px | — | — |
| List summary | 14–15px | 1.6–1.65 | — |
| Section label (uppercase) | 13px | — | 0.12em, uppercase |
| Kicker (uppercase, accent) | 11px | — | 0.12em, uppercase |
| Nav link | 13px | — | — |
| Date / meta | 12–13px | — | — |
| Field label (uppercase) | 11–12px | — | 0.1em, uppercase |

All prose blocks use `text-wrap: pretty`. Measure caps: 52–64ch on list summaries and
body copy; 620–680px max-width on prose columns.

### Spacing & shape
Content column: `max-width: 920px; margin: 0 auto; padding: 0 28px`.
Prose sub-columns: 620px (Now, Contact), 640px (post body, Writing intro), 660px (hero,
About), 680px (project detail).
Radii: `--radius-sm` 4px, `--radius-md` 8px (used on all hover rows), `--radius-lg` 14px.
Spacing scale (density 0.7×): 2.8 / 5.6 / 8.4 / 11.2 / 16.8 / 22.4px. Section rhythm in the
design uses larger literal values: 88px top of hero, 72px page tops and between home
sections, 64px before footer, 40px/36px within articles.
Shadows: `--shadow-sm: 0 0 0 1px #3f424d`; md/lg add ambient black. None are used in this
design — elevation here is a hairline rule, not a shadow.

## Screens / Views

### 1. Header (persistent)
Sticky top, `z-index: 10`, background `color-mix(in srgb, var(--color-bg) 88%, transparent)`
with `backdrop-filter: blur(10px)`. Inside the 920px column: 14px/28px padding, flex row,
gap 22px, wraps. Brand "Eren Ege Çelik" at 16px weight 500, tracking -0.01em, pushed left
with `margin-right: auto`. Then five 13px links: Work, Writing, About, Now, Contact.
Active link is `var(--color-accent)`; inactive is text at 68%; hover goes to accent.
Below the bar: the 1px fading rule.

### 2. Home
- Kicker: "İzmir & Ankara, Turkey" — 11px uppercase accent, 20px below.
- h1 "Eren Ege Çelik" 56px.
- Lead (19px, 82%): "Physics undergraduate at METU. I build quantitative trading systems for prediction markets, and write up what I find."
- Availability line (15px, 58%): "Looking for a quantitative research or trading internship for summer 2027." — configurable.
- Button row, gap 10px: primary "See the work" (internal nav), secondary "GitHub"
  (https://github.com/ErenEgeCelik), secondary "Email" (mailto:erenege3500@gmail.com).
- Section 88px→64px padding, max-width 660px, fades in: `@keyframes` opacity 0→1 +
  `translateY(6px)`→none, 0.5s ease.
- **Selected work** — 13px uppercase label at 60%, "All work →" link pushed right.
  Three rows, each a link: 2-column grid (`1fr auto`), 20px/12px padding with `-12px`
  negative margin, `border-top: 1px solid var(--color-divider)`, radius 8px, hover
  `background: color-mix(in srgb, var(--color-text) 5%, transparent)`. Left: 19px title +
  one-line short description (14px, 62%, max 56ch). Right: year, 12px, 45%, nowrap.
- **Writing** — same label + "All posts →", two rows in the same row pattern (18px padding,
  16px title, date right-aligned).
- No stats band. (An earlier version had one; the numbers were removed at the user's
  request — quantitative claims live on project detail pages only, in context.)

### 3. Work (projects index)
h1 44px + intro (17px, 70%, max 640px): "Live systems and research on prediction markets,
plus laboratory and engineering work. Everything here is something I built, derived, or
falsified myself."
Then five project rows: 24px/12px padding, top divider, radius 8px, same 5% hover tint.
Each row = title (21px, -0.015em) with year pushed right (12px, 45%), summary (15px, 65%,
max 64ch), then a wrapping 6px-gap row of `.tag.tag-neutral` chips (3 per project).
Below, an "Elsewhere" `.table` — three rows, first cell 38% wide, third right-aligned:
- Volunteer research intern | Prof. Ali Bozbey's group, TOBB ETÜ — superconducting quantum hardware | 2025
- Engineering intern | Ingenieurbüro Bickele & Bühler GmbH, Stuttgart — SMD, AOI, C# and Arduino | 2023
- Organizing staff | ICSM & ICSQMT international conferences | 2025–26

### 4. Project detail
Article, max-width 680px, 56px top padding.
"← Work" back link (13px), 32px below. Kicker (11px uppercase accent). h1 40px. Summary
(18px, 78%). Then a metadata strip: `grid-template-columns: repeat(auto-fit, minmax(160px, 1fr))`,
gap 20px, 20px vertical padding, divider top AND bottom — three fields Role / Period /
Stack, each an 11px uppercase 45% label + 14px value. Then N sections (3–4 per project),
each h2 22px + one paragraph (16px / 1.75, 76%), 36px apart. Footer: divider top, then
primary "Repository & paper" (GitHub) + secondary "Ask me about it" (→ Contact).

Five projects, in order — full copy is in the prototype's logic class (`PROJECTS` array):
1. `market-maker` — "Reverse-engineering a prediction market maker" (2026)
2. `binary-mm` — "Binary market making under CARA utility" (2026)
3. `weather` — "Weather derivatives, three edges deep" (2026)
4. `worldcup` — "World Cup cross-market relative value" (2026)
5. `infra` — "Low-latency multi-venue data infrastructure" (2026)

Each carries: `slug, kicker, title, year, role, stack, summary, short, tags[], sections[{h,p}]`.
`short` is the compressed one-liner used on Home; `summary` is the longer index/detail line.
**This is the content schema to model in the real codebase** — one MDX/JSON file per project
with exactly these fields.

### 5. Writing (blog index)
h1 44px + intro (17px, 70%): "Notes on microstructure, modelling, and the parts of research
that don't make the highlight reel."
Three post rows: 24px/12px padding, divider top, radius 8px, 5% hover. Title 20px (-0.015em,
max 52ch) with date pushed right (12px, 45%), then excerpt (15px, 62%, max 62ch).

### 6. Post detail
Article, max-width 640px, 56px top padding. "← Writing" back link. h1 38px/1.12. Meta line
`{date} · {read}` (13px, 45%), 40px below. Body paragraphs 17px / 1.8 at 80%, 22px apart.
Footer: divider top, "← All posts".

Three posts (`POSTS` array, fields `slug, title, date, read, excerpt, body[]`):
1. "The result I published because it made me look worse" — July 2026, 6 min
2. "What thirty dollars teaches that a paper account cannot" — June 2026, 4 min
3. "Physics gave me the priors; markets gave me the feedback loop" — May 2026, 5 min

Note: post bodies in the prototype are drafts written in the user's voice and are expected
to be rewritten by him before launch. Treat copy as provisional; treat structure as final.

### 7. About
Max-width 660px. Header row: flex, `align-items: flex-end`, gap 24px, wraps — a 140×180px
portrait slot (radius 8px, `overflow: hidden`, wrapped in `.lighten`) beside the 44px h1.
Then three paragraphs (18px/1.75 at 80%, then 17px/1.75 at 72%). Then:
- **Education** — 13px uppercase label + `.table`, two rows (first cell 52%): BSc Physics,
  METU (ODTÜ), Ankara, 2024–2028 · Physics, İzmir Institute of Technology (İYTE), GPA 3.6/4.0,
  İzmir, transferred.
- **Honors** — bulleted list, 16px/1.8 at 76%, three items (math olympiad team, physics
  olympiad team, İzmir Atatürk High School admission).
- **Skills** — `grid-template-columns: repeat(auto-fit, minmax(240px, 1fr))`, gap 24px. Two
  groups, "Quantitative" and "Technical", each a 14px heading + wrapping `.tag.tag-neutral`
  chips.

### 8. Now
Max-width 620px. h1 44px + "Updated August 2026" (13px, 45%). Then an unstyled `<ul>`,
`list-style: none`, flex column, gap 26px. Each item has `padding-left: 18px` and a 2px
left border — **the first item's border is `var(--color-accent)`, the rest
`var(--color-divider)`** (a single accent mark, per the system's rules). Item = 18px
heading + 15px/1.7 body at 68%. Four items: trading/researching prediction markets, third
year at METU, looking for a quant internship, writing up the backlog.

### 9. Contact
Max-width 620px. h1 44px + lead (18px/1.7, 76%). Then three link rows: flex, gap 16px,
18px/12px padding, divider top (last also bottom), radius 8px, 5% hover. Each row = an
80px fixed-width 12px uppercase 45% label (Email / GitHub / Site) + a 16px value
(erenege3500@gmail.com · github.com/ErenEgeCelik · erenege.com). Below, 36px down: primary
"Write to me" (mailto) + secondary "Résumé" (currently points at the .docx in `uploads/`;
**replace with a real PDF**).

### Footer (persistent)
64px above, inside the 920px column, 24px/28px padding. The fading 1px rule, then a flex
row: "© 2026 Eren Ege Çelik · İzmir & Ankara" (12px, 42%) with `margin-right: auto`, then
12px Email and GitHub links.

## Interactions & Behavior
- **Navigation** is client-side state (`{page, slug}`) with `preventDefault()` on every
  internal link. In the real build, replace with real routes:
  `/`, `/work`, `/work/[slug]`, `/writing`, `/writing/[slug]`, `/about`, `/now`, `/contact`.
  Real URLs matter here — the audience is recruiters who will link to specific projects.
- **Scroll reset**: `window.scrollTo(0, 0)` on every page/slug change. Framework routers
  usually do this; verify.
- **Hover** on every list row: `background: color-mix(in srgb, var(--color-text) 5%, transparent)`
  with the 8px radius and the -12px negative horizontal margin, so the tint bleeds past the
  text column. No transition is specified; a 120–150ms ease is acceptable.
- **Links** hover from `--color-accent` to `--color-accent-300`.
- **Focus**: `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }`
  comes from the Nocturne stylesheet — keep it, never the browser default.
- **Home entrance animation**: the hero section only, 0.5s ease, opacity + 6px rise.
- External links (`GitHub`, `erenege.com`) open in a new tab with `rel="noopener"`.
- Responsive: everything is a single 920px centered column with 28px gutters; the header,
  button rows, skills grid, metadata strip and About header all wrap via `flex-wrap` or
  `auto-fit` grids. No breakpoints are declared. Verify on 375px width and reduce the 56px
  and 44px headings if they crowd.

## State Management
Prototype-only: `{page, slug}`. In a routed implementation there is **no client state** —
the site is fully static. Content should be file-backed (MDX or JSON per project/post),
loaded at build time.

Three prototype "tweak" props exist and should become site config or content fields:
`availability` (the Home availability line), `resumeUrl`, `accentColor`.

## Assets
- **Fonts**: Inter 400/500 from Google Fonts. Self-host in production.
- **Portrait**: not supplied. About has an empty 140×180 drop slot; the prototype uses a
  local `image-slot.js` placeholder component that must **not** ship. Replace with a real
  `<img>` inside a `.lighten` wrapper. Guidance given to the user: shoot on a dark/black
  background so it blends into the page.
- **Project imagery**: none yet. Detail pages are text-only by design for now; the user was
  asked for screenshots.
- **Résumé**: `uploads/Eren_Ege_Celik_Resume.docx` — needs a PDF replacement.
- **Icons**: none used. If adding, use Phosphor.

## Files
- `Personal Site.dc.html` — the full prototype: template markup (all eight views) plus a
  logic class holding the `PROJECTS` and `POSTS` content arrays and the nav state. Copy
  and structure are authoritative here.
- `_ds/styles.css` — the Nocturne stylesheet: `:root` tokens plus `.btn`, `.tag`, `.table`,
  `.card`, `.nav`, `.field`, `.lighten` component classes. Port the tokens from this file.
- `_ds/readme.md` — the design system's own guide (direction, do/don't, component index).
- `image-slot.js` — prototype-only portrait placeholder. Do not ship.

## Suggested first steps for Claude Code
1. Read `_ds/readme.md`, then port the `:root` block from `_ds/styles.css` into the
   codebase's token layer.
2. Set up the two content collections (`projects`, `posts`) with the field schemas above and
   migrate the content out of the `PROJECTS` / `POSTS` arrays in `Personal Site.dc.html`.
3. Build the shared layout: sticky blurred header, 920px column, fading-rule footer.
4. Build the list-row primitive (divider top, negative margin, 5% hover tint) once — Home,
   Work, Writing and Contact all use it.
5. Then the eight views, then metadata: title/description per page, OG image, sitemap, RSS
   for `/writing`.
