# Content audit — 2026-08-07

Read-only audit against the canonical sources. **No site files were edited.**

Sources consulted, in the claim-hierarchy order from the brief:

- `D:\crypto-bot\PROJECT_STATE.md` (2026-07-16), `MDP3_VERDICT.md` (2026-07-14), `MDP3_METHODS.md`,
  `RESEARCH_LOG.md` (newest entry 2026-08-04), `MM_MODEL.md`, `WHITEPAPER.md`, `CLAUDE.md`
- `D:\crypto-bot\portfolio\EVIDENCE_LEDGER.md`, `CV_HANDOFF.md`, `CASE_STUDY.md`
- `D:\eren-os\personal-context\` — `profile.md`, `goals.md`, `cv/CV_HANDOFF.md` (**dated today**),
  `cv/project-priority.md`, `projects/trading-model-2.md`, `trading-model-3.md`
- `Desktop/jobapplication/Eren_Ege_Celik_CV_PredictionMarkets_v2.docx` (modified today, 02:43)
- GitHub API — public repo list for `ErenEgeCelik`

One source-precedence note that changes how the rest of this reads: **`MDP3_VERDICT.md` is itself
stale.** `EVIDENCE_LEDGER.md` §5.5 queues it for replacement, and row `C-POLICY-01` states that the
front-quoting rejection "supersedes older positive D3d/MDP3 verdict language." So the `+0.616` and
`+1.368` figures in that file are **not** current, despite it ranking #5 in the brief's read order.
The ledger and `RESEARCH_LOG` outrank it.

---

## 1. Page-by-page content inventory

| Route | Source file | Words | Claim density | State |
|---|---|---|---|---|
| `/` | `content/home.md` + `work.ts`/`writing.ts` | ~40 + list rows | Low (project `short` lines carry the numbers) | Current |
| `/work` | `content/work/*.md` frontmatter | 4 rows | Medium | Ordering current |
| `/work/weather` | `content/work/weather.md` | 3,773 | **Very high** | 2 stale numbers |
| `/work/worldcup` | `content/work/worldcup.md` | 2,506 | High | Current, one framing issue |
| `/work/crypto-mm` | `content/work/crypto-mm.md` | 1,085 | **Very high** | **Materially out of date** |
| `/work/infra` | `content/work/infra.md` | 791 | Medium | 1 unsourced figure |
| `/writing` | merged papers + blog | 6 items | — | 3 of 6 cover one project |
| `/writing/polymarket-5min-microstructure` | whitepaper | 3,274 | Very high | Correct **for its June date** |
| `/writing/btc-5min-reference` | whitepaper | 751 | High | Current |
| `/writing/verifier-first-protocol` | blog | 642 | Medium | Current |
| `/writing/thirty-dollars` | blog | ~600 | Low | 1 phrasing violation |
| `/writing/negative-result`, `/physics-to-markets` | blog | ~600 each | Low | Current |
| `/about` | `content/about.md` + `resume.ts` | 322 + tables | Medium | **Education wrong** |
| `/cv` | `src/lib/resume.ts` | — | High | **Two generations behind** |
| `/now` | `content/now.md` | 4 items | Low | 1 item stale |
| `/contact` | `contact/page.tsx` | — | — | Current |

---

## 2. Claim audit

Scope labels use the ledger's vocabulary: OFFLINE REPLAY · LIVE PAPER · MICRO LIVE ·
STRUCTURAL REPLICATION · OWNER-VERIFIED ACCOUNT · SUPERSEDED.

### 2.1 Critical — factually wrong as published

| # | Page | Current wording | Scope | Source | Verdict | Correction |
|---|---|---|---|---|---|---|
| **A1** | `/work/crypto-mm` L33 | "the incumbent scored a Brier of 0.2089 and I scored 0.2011" | STRUCTURAL | `WHITEPAPER.md` L73; `MM_MODEL.md` L34 | **INVERTED** | The numbers are swapped. Source: "MM mid is better calibrated than our best fair: Brier **0.2011 (MM)** vs **0.2089 (ours)**". `MM_MODEL.md` independently: "our Brier 0.182 vs market 0.175 … **we MATCH, we do not BEAT**." |
| **A2** | `/work/crypto-mm` L79 | "**The surviving design** earned +$1.07 per slot over a 555-slot paper campaign … adverse-fill rate down from 65% to 34%" | SUPERSEDED | `EVIDENCE_LEDGER` `C-HIST-01`, `C-ADVERSE-01` | **Two prohibited claims** | Both rows are HISTORICAL_SUPERSEDED. The v5 campaign used 330/200 ms **taker-path** assumptions, wrong for maker decisions. 65%→34% came from **3,661 simulated shadow fills at 0 ms execution** — the ledger names "Reduced live adverse fills from 65% to 34%" as prohibited verbatim. "The surviving design" is the false part: it did not survive. |
| **A3** | `/work/crypto-mm` L75 | "Tape simulation credited +123.5 c/slot **on the weekend the live arm lost $31**" | OFFLINE REPLAY vs LIVE PAPER | `PROJECT_STATE` §D16; `cv/CV_HANDOFF` §3 | **Conflates two measurements** | +123.5 c/slot [103,144] is the **pooled** W-block (368 slots, 8/8 tapes). The exact matched six-slot comparison is **replay +$21 vs paper −$31**. CV_HANDOFF lists this exact conflation as a "do not restore" item. |
| **A4** | `/work/crypto-mm` — whole page | Leads with reverse-engineering + the $1.07 paper result | — | `RESEARCH_LOG` 2026-07-19; `PROJECT_STATE` | **Missing the current verdict** | The fresh-OOS static-front rejection is absent: **−0.9845 c per eligible quote moment, CI90 [−1.626, −0.364], 312 eligible moments / 193 slots**. This is now the page's primary result. |
| **A5** | `/work/weather` L81 | "Polymarket applies roughly a **three-second** delay to taker orders" | — | `crypto-bot/CLAUDE.md` L15 (owner-corrected 3×) | **~10× wrong** | Ledger: maker POST 24–50 ms · cancel p50 23–50 ms · cancel p99 under load 218 ms · **taker path / server delay ~250–330 ms**. |
| **A6** | `/about`, `/cv` (`resume.ts` L11,17) | METU "2024 — 2028"; İYTE "transferred" | — | `CV_PredictionMarkets_v2.docx` (today) | **Wrong** | CV: **ODTÜ 2025 – Jun 2028**; **İYTE 2024 – 2025**. Current site reads as if he was at METU from 2024. |
| **A7** | `/cv` (`resume.ts` L35) | "Grew a single $30 deposit to **~$1,200 in net P&L**" | OWNER-VERIFIED ACCOUNT | Owner correction #1 in the brief | **Wrong frame** | Owner permits the claim but requires **account growth/value**, not "$1,200 PnL". Same fix in `content/blog/thirty-dollars.md` L19. |

### 2.2 Scope not stated clearly enough

| # | Page | Current | Verdict | Correction |
|---|---|---|---|---|
| B1 | `/work/weather` §6.2 | "Mean improvement across all 28 markets was about **24%**" | Needs scope + baseline | It is **24.2% mean Brier reduction vs the prior model configuration**, 28/28 fits improved, **offline replay**, and the **final calibration was never deployed** (`trading-model-3.md` L20, L52). §9 says "I stopped before deploying it" 90 lines later — the scope must sit at the claim. |
| B2 | `/work/weather` §6.3 | "Those six had been running an incoherent posterior" | Incomplete | The °F unit-chain **fix was written but never deployed** (deployment held for sign-off as money-adjacent). Past tense implies it was fixed. |
| B3 | `/work/weather` §2 opening | "three edges deep" narrative | Framing | The third edge (forecast calibration) was **never traded**. The arc must not read as three live edges. |
| B4 | `/work/crypto-mm` L31 | "R² 0.92 over **380 slots**, about six ticks out of sample" | Unsourced n | `MM_MODEL.md` gives **median within-slot** R²=0.92; the 404-slot figure belongs to the Brier comparison. "380 slots" appears in no source. Also specify *median within-slot* R². |
| B5 | `/work/infra` | "~**24 GB** of tick data recorded" | Unsourced | `DATA_INVENTORY.md`: 1.02 GB gz / ~9.7 GB uncompressed pulled. anabot ~2 GB. Weather OOS replay 3.3 GB. 24 GB may be a correct all-projects total but no source states it. |
| B6 | `/work/worldcup` `short:` | "**+67% on its best match**" | Cherry-picked | Percentage return on a $12 contract with a $30 bankroll cap. `cv/CV_HANDOFF` §3: "Do not overemphasize the small absolute PnL." Absolute (+$16 over 4 matches) is in the body and is the honest lead. |
| B7 | `/about` honors (`resume.ts` L24) | Physics Olympiad team "(**among Turkey's top 5**)" | Unsourced escalation | Neither `profile.md` nor the v2 CV contains the top-5 claim. Both say only "Physics Olympiad team, İzmir Atatürk High School". |

### 2.3 Verified correct — leave alone

`4m44s` MGM-vs-NOAA lead · `10,163 ms → 58 ms` fire path · `−$0.58 EV/$1` across 32 events ·
`23 s → 0.15 s` repricing window · World Cup max divergence `0.0028` and live agreement `within 0.02` ·
live A/B `Δ +22.7 c/slot, ci90 [−16.7, +61.4]` · `~250 ms` server taker delay in the BTC paper ·
`R² 0.92` and `~6-tick` OOS RMSE as *structural replication* · the paper's Brier direction (L94 is
**correct** — it is the case study that is wrong) · `/now` "penultimate year 2026–27, graduate June 2028"
(consistent with ODTÜ 2025–2028).

---

## 3. Contradictions and staleness

1. **Site contradicts itself on Brier.** `/writing/polymarket-5min-microstructure` L94 says the MM is
   better calibrated than any model built. `/work/crypto-mm` L33 says the opposite. Same site, same
   numbers, opposite attribution. A reader who opens both loses trust in everything else.
2. **`/work/crypto-mm` predates the entire July research program.** The page reflects the June
   whitepaper. D0–D16 (July) produced the front rejection, the sim-live wall, the EVM work and the
   inconclusive live A/B. Only the A/B made it onto the page.
3. **`/now` is wrong about the repos.** It says public companion repositories are "in progress".
   `github.com/ErenEgeCelik/prediction-market-research` has been **public since 2026-08-05** —
   "Research write-ups: systematic trading on prediction markets — probability engines,
   microstructure, and a defended negative result". No page links to it.
4. **`/cv` is two generations behind.** `resume.ts` was built from `Eren_Ege_Celik_Resume.docx`
   (Jul 27, general-purpose). The current target document is
   `Eren_Ege_Celik_CV_PredictionMarkets_v2.docx` (today) — different structure, different education
   dates, different percentile, and it deliberately drops the $30→$1,200 line.
   `public/Eren_Ege_Celik_Resume.pdf` (Jul 26) is what every "Résumé (PDF)" button serves.
5. **Exam percentile conflicts between two owner-authored sources.** `profile.md` says top ~0.2%;
   the v2 CV says top 0.7%. `cv/CV_HANDOFF` §8.6 flags this as unresolved. Not mine to pick.
6. **The whitepaper's date does real work and is not visible enough.** Dated 2026-06-17, its
   conclusions are honest *for June*. Sitting beside an updated case study it will look either stale
   or contradictory unless it is explicitly framed as a snapshot.
7. **`/writing` is 3-of-6 on one project** (microstructure paper, plain-language reference,
   verifier-first note). Raised previously, still open.
8. **`/about` duplicates `/cv`** — education, honors and skills render on both. Also still open.
9. **The CV PDF cites `erenege.com`**, which is in redemption and cannot currently be bought.

---

## 4. Site map and navigation decision

**Recommendation: keep the current navigation exactly as it is.** Home · Work · Writing · About ·
Now · Contact already maps cleanly onto the brief's proposed roles. Adding `/method` to the nav bar
would put a philosophy page at the same level as the evidence, which inverts the priority for a
recruiter who has ninety seconds.

Proposed, not implemented:

- **`/method`** as an unlisted page linked from Home and About. It carries the chain: market
  philosophy → axioms and observables → state/action/transition/reward skeleton → probability chains
  → theoretical EV → unknown-variable bounds → replay/paper/live coverage tests → policy update or
  rejection. This is the genuine differentiator and it currently exists only as three paragraphs on
  `/about`.
- **A reusable evidence block** on each case study: Question · System · Evidence · Result · Verdict ·
  Limitations. Rendered as the existing `.facts` metadata strip so no new visual language is
  introduced.
- **Repo links** on `/work` and `/now` pointing at `prediction-market-research`, now that it is real.

---

## 5. Prioritized implementation plan

**Stage 1 — corrections only (no new pages, no design changes).** Nothing else should ship first;
until this lands, adding content makes the site *more* wrong, not less.

1. `A1` Brier inversion on `/work/crypto-mm`.
2. `A2` remove "+$1.07/slot as the surviving design" and the unqualified 65%→34%.
3. `A3` split the pooled +123.5 c/slot from the exact six-slot +$21 / −$31.
4. `A4` add the fresh-OOS front verdict as the page's primary result; move the historical positives
   into an explicitly labelled superseded block.
5. `A5` weather taker delay → the corrected latency ledger.
6. `A6` education dates from the v2 CV.
7. `A7` account-growth phrasing in `resume.ts` and `thirty-dollars.md`.
8. `B1`–`B7` scope qualifiers.
9. `/now`: replace the "in progress" repo item with the live link.

**Stage 2 — sync `/cv` to the v2 prediction-markets CV**, regenerate the PDF, and repoint
`RESUME_PDF`. Blocked on Q3 below.

**Stage 3 — the `/method` page**, the evidence blocks, and the three system diagrams.

**Stage 4 — Home framing (Model → Execute → Falsify)** and cross-links between projects, writing and
repos.

Build and visual check after each stage. No deploy until reviewed.

---

## 6. Exact proposed changes per page

Wording below is a proposal for review, not applied.

### `/work/crypto-mm` — the heaviest rewrite

**Remove:** "the incumbent scored a Brier of 0.2089 and I scored 0.2011" (inverted) · "The surviving
design earned +$1.07 per slot … adverse-fill rate down from 65% to 34%" · "+123.5 c/slot on the
weekend the live arm lost $31" as a matched comparison · "over 380 slots".

**Add — new primary verdict, replacing the current §"The test that broke the rest" lead:**

> Fresh out-of-sample data rejected the static maker front: **−0.9845 cents per eligible quote
> moment**, 90% slot-clustered CI **[−1.626, −0.364]**, over **312 eligible moments across 193
> slots**. The interval excludes zero. An earlier version of the same measurement was positive; a
> latency correction I had modelled wrong — orders activate 50 ms after the decision, so the first
> 50 ms of prints are uncatchable — accounted for two thirds of the apparent edge.

**Add — corrected sim-to-live section:**

> Over the same weekend, tape replay credited **+123.5 c/slot** [103, 144] across 368 slots, positive
> on all eight tapes. In the exact six slots where the live paper arm lost **$31**, the replay
> credited **+$21**. The simulator's best windows were the live arm's worst.

**Correct the calibration paragraph:**

> Over 404 slots the incumbent's mid is better calibrated to resolution than my best fair value:
> Brier **0.2011** against my **0.2089**. Replicating a quote schedule is structural understanding,
> not alpha, and I made "the incumbent is good at fair value" an explicit axiom rather than an
> assumption I had not noticed making.

**Add — labelled superseded block near the end:**

> **Superseded results.** An earlier paper campaign reported +$1.07/slot over 555 slots, and a
> shadow implementation reduced measured adverse fills from 65% to 34% across 3,661 simulated fills.
> Both assumed an execution path I later measured as wrong — the first used taker-path latency for
> maker decisions, the second assumed 0 ms execution. Neither is evidence for the current system.

Frontmatter `short:` and `summary:` need rewriting around the negative verdict and the measured
simulator blind spot rather than "reverse-engineered to R² 0.92".

### `/work/weather`

- §2 "How it died": three-second delay → "Polymarket's taker path carries roughly 250–330 ms of
  server-side delay". Everything else in that paragraph stands.
- §6.2: "**24.2%** mean Brier reduction **against the prior model configuration**, 28/28 fits
  improved, 3.5–49% range" + "This is an offline replay result. The final calibration was never
  deployed to production."
- §6.3 unit mismatch: add "The fix was written but never deployed — I held it for sign-off because
  it was money-adjacent."
- §2 opening: make explicit that the third edge was modelled and never traded.

### `/work/worldcup`

- `short:` lead with "+$16 across four matches" and drop "+67% on its best match", or keep the
  percentage only alongside the position size.

### `/work/infra`

- Source or drop "~24 GB".
- Judgment call, not a rule violation: the machine table names "İzmir, home Linux box" while
  `/about` gives the city. No IPs or instance IDs are exposed, so the brief's security rules are
  satisfied, but a home machine running trading infrastructure is identifiable to a city. Consider
  "residential Turkish IP" without the city.

### `/about` and `/cv` (`resume.ts`)

- Education → ODTÜ 2025 – Jun 2028; İYTE 2024 – 2025 (GPA 3.6/4.0, transferred). Consider adding
  İzmir Atatürk High School 2020–2024 and the Kadir Has summer school, both of which the v2 CV
  carries.
- Honors → drop "(among Turkey's top 5)" unless sourced. Percentile pending Q1.
- Experience bullet → "Grew a self-funded Polymarket account from roughly $30 to roughly $1,200 with
  no further deposits" (account value, not P&L).

### `/now`

- Replace the "Opening up the code" item:

> **Publishing the research.** `prediction-market-research` is public — the write-ups plus
> self-contained reference implementations, so the reasoning is inspectable without shipping a live
> execution stack. The trading systems themselves stay private.

### `/writing/polymarket-5min-microstructure`

- Add a dated snapshot note under the title: the paper reports the June study; the July program
  revised several verdicts, and the case study carries the current position.

---

## 7. Questions requiring owner confirmation

**Resolved by the owner on 2026-08-07 — items 1, 2, 4 and 9 are closed:**

- **Percentile: top 0.7%.** The 0.2% figure is the *school's present admission cutoff*, not his
  result. He sat the exam when İzmir Atatürk High School admitted down to the top 1% and scored
  **top 0.7%**. `profile.md` conflated the two and should be corrected at source.
- **"Top 5" belongs to the school, not the olympiad team.** İzmir Atatürk High School is among
  Turkey's five highest-scoring high schools by entrance rank. He was on that school's Physics
  Olympiad team in his final year, and was selected to the İzmir Mathematics Olympiad team at the
  start of grade 8 — the candidate pool for the national team — leaving it on starting high school.
- **$30 → $1,200 is stated at account level**, not attributed to a single project, even though
  nearly all of it came from the weather system.
- **The Turkey geoblock stays off the site.** Execution runs from the Ireland VPS regardless, so it
  is not a material fact about the work.

**Still open:**

1. ~~National exam percentile~~ — resolved above.
2. ~~"Among Turkey's top 5"~~ — resolved above.
3. **Should `/cv` mirror `Eren_Ege_Celik_CV_PredictionMarkets_v2.docx`?** The site currently mirrors
   the older general-purpose résumé. If yes, the PDF needs regenerating and `RESUME_PDF` repointing —
   the buttons currently serve a Jul 26 file.
4. ~~Is the $30 → $1,200 growth attributable to the weather system?~~ — resolved above; the weather
   page now says "across everything I was running".
5. **Does the whitepaper get a revision, or a dated-snapshot banner?** It is honest for June and
   several of its verdicts have since moved.
6. **`/writing` has three items on the same project.** Merge the plain-language reference into the
   paper, or leave the overlap?
7. **`/about` duplicates `/cv`'s education, honors and skills.** Intentional, or should `/about`
   stay prose-only and link across?
8. **Domain.** `erenege.com` is in redemption and unbuyable; the v2 CV prints it as a live contact.
   `erenegecelik.com` ($11.25/yr) and `erenege.dev` ($9.99/yr) are available.
9. ~~Should the geoblock go on `/now`?~~ — resolved above; it stays off.

10. **Is "~24 GB of tick data" correct?** `/work/infra` breaks it into ~19 GB crypto and ~5 GB
    weather/football. `DATA_INVENTORY.md` documents 1.02 GB gzipped (~9.7 GB uncompressed) pulled
    from the VPS plus 3.0 GB of duplicates, and `trading-model-2.md` gives ~2 GB for anabot. The
    total is plausible across all local logs but no document states it. Left as written, pending a
    one-line confirmation.

---

## Appendix — uncommitted work in the tree

The stop-slop pass from the previous session is still uncommitted: `content/blog/verifier-first-protocol.md`,
`content/whitepapers/btc-5min-reference.md`, `content/whitepapers/polymarket-5min-microstructure.md`,
`content/work/weather.md`, `content/work/worldcup.md`, `.claude/skills/stop-slop/SKILL.md`.
That pass also removed live strategy parameters (`γ = 0.04, BETA = 0.04, K = 10`), an internal
revision reference, and a two-wallet infrastructure disclosure from the public reference note.
Those removals should not be reverted.
