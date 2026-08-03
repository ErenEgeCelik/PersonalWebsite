---
title: "World Cup cross-market relative value"
slug: "worldcup"
order: 2
kicker: "Live strategy · Polymarket"
year: "2026"
period: "June 2026"
role: "Independent trader"
stack: "Python, Monte Carlo, Bayesian updating, conditional precompute"
venue: "Polymarket — FIFA World Cup match and group-outcome markets"
short: "Pricing group-advancement markets against the match markets they depend on."
summary: "Match markets and group-advancement markets price the same underlying uncertainty. When they disagree, the mispricing is mechanical — a Bayesian link plus a Monte Carlo of the standings makes it explicit."
tags: ["Relative value", "Monte Carlo", "Bayesian"]
---

## Summary

When the reactive edge in the weather markets I had been trading closed, I went looking for the same
structure elsewhere. This is what I found, built, and ran with real money during the 2026 World Cup
group stage. It shares no code or thesis with the weather project beyond the general approach.

The strategy is not latency arbitrage. It translates information from one market into fair value in
another.

A football match's moneyline market is the most liquid, fastest and most accurate probability source
available for that match. When a goal is scored it reprices within milliseconds. The *dependent*
markets — group winner, advance to knockout, group last place — are thin, slow, and take minutes to
absorb the same information. A Monte Carlo group simulator converts the match market's updated
win/draw/loss probabilities into fair values for those dependent contracts, and the system takes a
position where the dependent market has not yet moved. The position is held to resolution.

Across four matches traded with real money the system netted roughly **+$16**, with a best match of
**+$17.44 on $25.97 deployed (+67%)**. More usefully, it produced four distinct failure modes that I
diagnosed and fixed with money on the line — including one where the model was confidently wrong in
a way that looked exactly like an edge.

---

## 1. The structure

Every group in the tournament is a four-team round robin: six matches, and a set of derived markets
priced off the final standings.

| Leg | Markets | Behaviour |
|---|---|---|
| **Fast** | Match moneyline (home / draw / away) | Reprices in milliseconds; 50% of the move within 0–73 ms of a goal. Deep books (~$30k at touch). No edge here — this is the signal source. |
| **Slow** | Group winner, advance to knockout, last place | Thin books, wide spreads, minutes of delay. This is where the position goes. |

The link between them is arithmetic. If the match market says the United States is now more likely
to win this game, the probability that the United States wins the group has changed by a computable
amount — and so has the probability that Paraguay finishes last. Nobody has to guess.

---

## 2. The probability engine

**Simulator.** `group_dist.py` takes the market-implied win/draw/loss probabilities for all six
matches in a group and runs a Monte Carlo over the remaining fixtures, producing the full joint
distribution of final standings — P(team, position). Contract fair values follow directly:

```
winner(team)  = P(team finishes 1st)
advance(team) = P(1st) + P(2nd) + P(3rd) × 8/12      ← 8 of 12 third-place teams qualify
last(team)    = P(team finishes 4th)
```

**Calibration against the market.** Before trusting it, I checked the model's output against the
market's own pre-goal prices — if the model is right, it should approximately reproduce prices that
already exist:

| Contract | Model | Market | Difference |
|---|--:|--:|--:|
| Group D winner — USA | 0.396 | 0.375 | +0.021 |
| Group D last place — USA | 0.111 | 0.100 | +0.011 |

Two points of agreement on independent contracts. That is the check that turned this from an
intuition into something I was willing to size.

The one contract where the model disagreed materially — advance, off by −0.126 — turned out to be a
genuine modelling gap rather than an edge: my definition was "top two" while actual qualification
includes the eight best third-place teams. The discrepancy divided by P(third place) came to 0.63,
against the true ratio of 8/12 = 0.67. The model was wrong in a way that explained itself, which is
the useful kind of wrong. I added the third-place term.

**Making it fast enough to trade.** A full 60,000-path simulation takes about two seconds, which is
too slow on the hot path when a goal has just been scored. Instead the engine precomputes, at
startup, the conditional standings distribution for each of the three possible outcomes of the match
being traded. A goal then becomes a *reweighting* of precomputed distributions rather than a new
simulation — effectively instant. I verified equivalence against the full simulation: maximum
divergence **0.0028**, within Monte Carlo noise.

**Combining fair value with the book.** `edge_scan.py` joins the model's fair value to the actual
ask-side depth recorded at 1 Hz, then simulates filling from the cheapest ask upward under a
per-order cap. That converts an abstract edge into a concrete answer: how many shares, at what cost,
for what expected profit. On the first goal of the USA–Paraguay match it projected roughly $30
deployed across six contracts for +$3.90 expected — and showed the edge staying open for a full 60
seconds, which told me execution speed was not the binding constraint here.

---

## 3. Live results

Four matches traded with real money, $30 bankroll cap and $12 per contract, with Kelly-lite sizing
scaled by available depth.

| Match | Deployed | Result | Note |
|---|--:|--:|---|
| Australia – Türkiye | $25.97 | **+$17.44 (+67%)** | 3 fires, all matched; 5 winners, 2 small losses |
| Netherlands – Japan | $27.47 | −$1.05 (−4%) | Draw; entered late, took self-cancelling positions |
| France – Senegal | ~$10 | ~−$0.21 | Detector root error; exit module locked +$0.47 automatically |
| England – Croatia | $15.76 | −$0.64 | Static-edge bug (below) |

Net across the four: roughly **+$16**.

The Australia–Türkiye result is worth unpacking because the largest single winner was also the least
attributable to skill. `last:Türkiye:Yes` returned +$10.27, bought at 0.077 when the match market
briefly implied Türkiye had weakened. It paid because Türkiye went on to lose 2–0. That is the
strategy working as designed — the match market said "Türkiye is weaker now", the model translated
that into the group table, and we took the dependent contract early. But it is also a bet whose
variance is dominated by a single match result. The cleaner evidence of leg-lag capture is the
gradual repricing in `advance:Australia:Yes` (0.435 → 0.67) and `winner:Türkiye:No` (0.69 → 0.79).
Stripping out the outcome bet, the underlying leg-lag return is closer to +30–40% than +67%.

---

## 4. Four failures, and what each one taught

This is the part I would want to discuss in an interview.

### 4.1 The detector was structurally blind to equalisers

The first detector looked for the scoring team's YES contract to spike upward. Switzerland–Qatar
finished 1–1 with a 90th-minute Qatar equaliser; the detector registered nothing.

The reason is structural rather than a tuning problem. On an equaliser the leading team's YES
*collapses*, the scoring team's YES moves from 0.00 to 0.01 — below any sensible threshold — and the
contract that actually rises is DRAW, which was not a trigger. Meanwhile the dependent markets moved
enormously and stayed mispriced for over two minutes: `winner:Switzerland:No` fair 0.544 against an
ask of 0.39, `advance:Qatar:Yes` fair 0.274 against 0.14. A 0.154 edge, open for 120 seconds, missed
entirely.

The fix was to stop trying to detect goals. The match market already publishes the new win/draw/loss
state; who scored is irrelevant to the arithmetic. I replaced the trigger with a watcher on material
change in *any* match outcome token. That catches equalisers, go-ahead goals, red cards and VAR
reversals with one rule.

### 4.2 Price movement is not information

A later match exposed the opposite error. At the 84th minute of a goalless France–Senegal, France
drifted 0.735 → 0.615 and draw rose 0.33 → 0.39. The detector fired and bought `winner:France:No`.
Five minutes later France actually scored, and the position was wrong.

Nothing had happened at minute 84. In a scoreless game the draw becomes more likely simply because
time is running out — the drift was the clock, not news. The distinguishing rule is that **a real
event always drives some outcome sharply upward**; a lone downward drift is a mirror of that decay
and tends to revert. I restricted the trigger to upward moves only. Equalisers are still caught,
because the draw contract rises.

### 4.3 The model was confidently wrong — the static-edge bug

This one cost real money and is the most instructive.

During England–Croatia the bot bought `advance:Ghana:Yes` and `advance:Panama:Yes`. Ghana and Panama
are in the same group, but they were not playing — their match was hours away. The positions made no
sense as a reaction to anything happening on the pitch.

The cause: the system was ranking opportunities by *model fair minus market price*, which conflates
two very different things. Ghana's qualification probability is driven almost entirely by Ghana's own
matches; its sensitivity to the England–Croatia result was **0.03**. But my model priced it at 0.51
against a market at 0.40, producing an apparent 0.11 "edge" that was pure model error. The strategy
is supposed to harvest *lag* — the market being slow to price information that has just arrived —
and instead it was harvesting my own disagreement with a market that had no reason to move.

The fix separates the two cleanly. For each candidate contract the engine already computes fair value
conditional on each of this match's three outcomes; the spread of those three values is the
contract's **sensitivity** to this match. A gate rejects anything below 0.08. In the England–Croatia
configuration that keeps `winner:England` (sensitivity 0.754) and `winner:Croatia` (0.727) while
eliminating `advance:Ghana` (0.031) and `advance:Panama` (0.030). The computation is free — the
conditionals already exist.

The general lesson is one I would carry to any relative-value strategy: *a difference between your
model and the market is not an edge unless you can name the event that will close it.*

### 4.4 The bot fought itself

In the Netherlands–Japan match the score swung repeatedly, and the system took `winner:Japan:No` and
later `winner:Japan:Yes`, plus both sides of Japan's advance market. Each signal was processed
independently, with no awareness of existing inventory. The positions largely cancelled, leaving the
spread as the only realised effect — which is essentially the whole −4% result.

I built a position book keyed by contract family with a block on opposing entries, and replayed it
against the live log: it correctly prevents $7.83 of self-cancelling purchases. But the replay also
showed the limit of the naive fix — one of the "opposing" buys was a genuine correction, because the
equaliser really had improved Japan's chance of advancing. Blocking it blocks a correct update. The
proper answer is to close the position whose thesis has been invalidated before opening the new one,
which is what the exit module now does.

---

## 5. Exit behaviour

An exit-timing study on the Australia–Türkiye positions produced a counterintuitive result. Taking
the same five positions and marking them out at the prevailing bid:

| Held for | Realised |
|---|--:|
| 0 min | **−12%** |
| 3 min | −6% |
| 10 min | +6% |
| 30 min | +8% |
| 45 min | **+24%** |
| 90 min | **+52%** |

Selling immediately loses money to the spread. The dependent market's *bid* climbs toward fair value
over tens of minutes — much more slowly than the ask moves — so the same slowness that creates a
cheap entry also delays the exit. This is a structural difference from the weather markets, where
market makers close the spread within seconds.

The conclusion is that this is not an intraday strategy. Positions are held to resolution, with two
exceptions implemented as an automatic exit module: **take-profit**, when the market has converged to
fair and the edge is spent; and **reversal**, when a subsequent goal invalidates the thesis — locking
the profit if the position is ahead, cutting the loss if it is not. The module proved itself in live
trading during France–Senegal, where it automatically took profit on `advance:Senegal:Yes` two
minutes before a France goal that would have erased it.

---

## 6. Market structure findings

- **Edge and liquidity are inversely related, consistently.** Small-nation matches produced thin
  books ($0–42 at touch), short lags, and enormous nominal edges — up to +109% on one contract — that
  could not be filled in size. Big-nation matches produced deep books ($100–4,400), a median stale
  window of 28 seconds, and modest edges of 2–12% that filled easily. This held across every match I
  recorded. The tradeable region is the middle: secondary contracts with both reaction delay and
  usable depth.
- **VAR is a first-order risk.** One match had two on-field goals overturned. The price impact of a
  reversal arrived 18–94 seconds after the original move, which is what calibrated the abort window
  (190 seconds, roughly twice the observed maximum).
- **Match selection matters more than execution.** Heavy-favourite matches carry almost no edge — the
  dependent markets have already priced the likely outcome. Balanced matches, where a goal materially
  changes the group table, are where the opportunity is. Draws are the worst outcome: nothing
  resolves, and every directional bet stays in limbo.
- **Kalshi has the markets but not the liquidity.** I surveyed 84 World Cup series there — match
  moneylines, group winners, qualification, stage-of-elimination, group ordering — a more complete
  set than Polymarket's. Every single one had zero volume and no quotes. The fair-value engine is
  exchange-agnostic and would work there unchanged; there is simply no counterparty. Worth revisiting
  if liquidity arrives.

---

## 7. Honest assessment

**What this demonstrates.** A probability model validated against market prices before being sized,
translated into executable orders against real book depth, run with real money, and corrected four
times when it was wrong. The static-edge bug in particular is the kind of error that looks like
profit until you ask what event is supposed to close the gap.

**Limitations.** Four matches is a small sample and the largest single winner was substantially an
outcome bet rather than captured lag. Position sizes were $5–30 against books that are frequently
thinner than that. The model covers the three contract classes that are fully determined by
win/draw/loss (winner, advance, last place); anything requiring a goal-scoring model — highest-scoring
group, goal-difference tie-breaks — was deliberately left out of scope rather than approximated.

**What I would build next.** Pair-locking, to close out the residual match-outcome variance rather
than carrying it to resolution; a fixture database to generalise beyond the groups I hand-mapped; and
the same edge-decay measurement I eventually ran on the weather strategy, applied here before scaling
rather than after.

---

## Appendix: components

| File | Role |
|---|---|
| `group_dist.py` | Monte Carlo standings distribution; conditional precompute |
| `groupsim.py` / `group_engine.py` | Fair value for any group, resolved from live market prices |
| `live_group.py` | Live engine: match WebSocket → outcome change → reweight → dependent book → edge → order |
| `portfolio.py` | Position book, opposing-entry block, reversal and take-profit exits |
| `edge_scan.py` | Fair value joined to recorded depth; fill simulation |
| `replay_match.py`, `pnl_live.py`, `exit_timing.py` | Post-match analysis, realised P&L, exit-timing study |
| `record_tokens.py` | Full-depth recorder: WebSocket events plus 1 Hz REST book snapshots |
