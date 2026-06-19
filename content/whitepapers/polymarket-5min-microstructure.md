---
title: "Microstructure and Efficiency of Polymarket's 5-Minute Cryptocurrency Binary Markets"
subtitle: "An empirical reverse-engineering and edge-search study"
slug: "polymarket-5min-microstructure"
date: "2026-06-17"
status: "Working paper"
tags: ["markets", "polymarket", "microstructure", "empirical"]
summary: "Over ~84 hours of recorded order-book data we reverse-engineer the dominant market maker as a Brownian-probit pricer, then verify-first our way through every candidate edge — none survive cost-inclusive out-of-sample testing. The negative result is the primary finding; the verifier-first protocol is the transferable contribution."
readingTime: "~15 min"
---

## Abstract

We study the 5-minute up/down binary markets on Bitcoin and Ethereum operated on Polymarket, resolved against the Chainlink BTC/USD/ETH/USD price feeds. Over roughly 84 hours of recorded order-book and multi-exchange tick data (~978 BTC and ~33 ETH healthy slots), we (i) reverse-engineer the dominant market maker's (MM) pricing model, (ii) characterise the latency structure between external price feeds and the on-chain order book, and (iii) conduct an exhaustive, verifier-first search for a tradeable edge. We find that the MM prices each slot as a Brownian-probit digital option, `fair = Φ((F − F₀)/(σ√τ))`, with feed `F = mean(Coinbase, Binance)`, and is **well calibrated** to the Chainlink resolution (Brier 0.2011 vs. our best model's 0.2089 over 404 slots). Every candidate edge we tested — directional hold-to-resolution, taker latency arbitrage, spike-scalping, split-sell with profit-lock, passive market making, slot-start cheap-side, dependent-market arbitrage, and six literature-derived hypotheses — **failed under out-of-sample, placebo, and cost-inclusive verification.** The single robust inefficiency, a feed-to-book reaction lag exceeding 400 ms on 43% of large spikes, is **not capturable** as a taker because of a ~250 ms server-side execution delay, and is weak as a maker because of adverse selection. We conclude the market is efficient at the retail-accessible level. The paper's secondary contribution is a **methodology**: a taxonomy of the statistical artifacts (look-ahead, spread-illusion, trend-skew, single-session noise, selection bias) that repeatedly manufactured false positives, and the verifier-first protocol that caught them.

---

## 1. Introduction

Polymarket lists a continuous series of 5-minute binary markets on BTC and ETH: at each slot boundary a "price to beat" is fixed, and the market resolves UP if the reference price 5 minutes later exceeds it, DN otherwise. Two tokens (UP, DN) trade on a central-limit order book (CLOB) with UP + DN = 1 at settlement. The structural appeal for a latency or microstructure trader is obvious: the resolution is a deterministic function of a public price feed, the horizon is short, and a dominant automated market maker quotes both sides continuously.

This paper documents a multi-week effort to find and monetise a durable edge in this venue, and the (negative) conclusion that none exists at the retail-accessible level. We treat the negative result as the primary finding and the **discipline that produced it** as the transferable contribution: at least five distinct classes of statistical artifact independently produced "edges" of +1.5c to +9c that evaporated under proper verification.

### 1.1 Central results

1. **The MM is a calibrated Brownian-probit pricer.** Its mid is better calibrated to resolution than any model we built (§4).
2. **A real feed→book reaction lag exists** (43% of large spikes lag >400 ms; §5) but is **uncapturable** because of a fixed ~250 ms server-side taker delay; the lag is mechanical (the book follows the feed), not informed.
3. **Every directional/structural edge is a false positive** once costs (the bid–ask spread and taker fee) and proper out-of-sample/placebo controls are applied (§6).
4. **Efficiency is uniform** across BTC and ETH and across the full slot lifecycle; the only deviations from the model are transient staleness episodes that the latency structure makes unexploitable.

---

## 2. Market structure and resolution

- **Instrument.** 5-minute binary on BTC (and ETH) up/down. Two ERC-1155 conditional tokens (UP, DN); CTF allows free split (1 USDC → 1 UP + 1 DN) and merge.
- **Resolution oracle.** The Chainlink BTC/USD data-stream, **not** spot exchanges. The "price to beat" (`priceToBeat` in the Gamma `eventMetadata`) is the Chainlink tick whose payload timestamp lands exactly on the slot boundary (`payload_ts_ms % 300000 == 0`). UP wins iff `CL[boundary+300s] > CL[boundary]`.
  - *Correctness note.* Anchoring resolution to the **first observed** Chainlink tick after the boundary is wrong: the ~1.2 s payload lag places that tick before the boundary, mis-signing the slot in up to ~p90 $3.66 / max $16 of drift. All resolution labels in this study use the boundary-aligned `priceToBeat`, verified to $0 against Gamma's `eventMetadata`.
- **Fees.** Taker fee ≈ `p·(1−p)·0.07` USDC per share (maximal near 0.50). Maker fee = 0, plus a ~20% rebate; however, 5-minute crypto markets are **not** in the CLOB liquidity-rewards pool (`rewards.rates = None`), so maker compensation is the thin rebate only.
- **Execution delay.** A constant ~250 ms server-side taker delay applies to all crypto up/down markets across assets and durations (BTC/ETH/SOL/XRP/BNB/DOGE, 5m and 15m). It is network-independent (confirmed by regional-VPS latency probes) — i.e. a *design* property, not a routing artifact.

---

## 3. Data and infrastructure

- **Capture topology.** An AWS Ireland VPS records the live feeds (`screen` session); a local laptop runs the live model/UI (the Polymarket data WebSocket is geo-blocked from some regions but reachable from the laptop); a home archive pulls logs via cron+rsync.
- **Feeds.** Binance and Coinbase direct WebSockets (sub-second, ms-stamped), Chainlink via Polymarket's real-time data stream (RTDS), plus Kraken and Bitstamp. The CLOB book (top-of-book bid/ask + sizes per token) and the trade-print stream (`last_trade_price`) are recorded.
- **Latency profile (one-way, to our process).** Direct WS ≈ **106 ms**; RTDS-relayed Binance ≈ 260 ms; RTDS-relayed Chainlink ≈ **1279 ms**. The direct feeds are the only ones fast enough to matter.
- **Recorded resolutions.** Two regimes: (a) **May event-logs** — full sub-second per-source ticks (cb/bn/kr/bs + book + Chainlink), 35 files, ~3.7 GB; (b) **June panels** — a 1 Hz model panel, augmented mid-study with sub-second trade-prints and (newly) raw per-event ticks. A 1 Hz panel under-resolves the sub-second lead-lag dynamics; the full-tick May data is the basis for all latency claims.
- **Coverage.** ~978 healthy BTC slots and ~33 ETH slots (~84 h) after data-hygiene filtering (book partitioned by slot boundary; freshness < 8 s; slot-edge blackout t_off ∈ [0,30) ∪ (270,300]).

---

## 4. The market-maker pricing model

The dominant MM was reverse-engineered from 380 BTC slots (the "MM model card").

### 4.1 Functional form

```
fair_UP(t) = Φ( (F(t) − F₀) / (σ · √τ) ),   τ = 300 − t_off
```

- **Feed `F = mean(Coinbase, Binance)`**, latency ≈ 300 ms. Alternative inputs (Chainlink relay; median of cb/bs/kr) were **falsified** by exclusive event tests (e.g. cases where the synthetic median had moved but the Chainlink relay had not, yet the mid moved → input is not the relay; cases where only Coinbase moved while Bitstamp/Kraken lagged ≥800 ms, yet the mid moved → input is not the median).
- **Anchor `F₀`** = feed-self at slot start. Using the Chainlink anchor instead induces a constant α·σ ≈ −$54 B–CL offset.
- **Brownian probit fit:** R² = 0.92. The form is operationally indistinguishable from logistic/piecewise within < 0.1 tick.
- **Spread:** 1c floor; widens with volatility and immediately post-spike.

### 4.2 Volatility

σ is **dynamic**, not constant: a constant-σ model breaks across the May→June regime. The card's estimate is `σ ≈ 3.41 + 0.40·realized₁₅`; our deployed live approximation is `σ ≈ 2.10 + 0.052·range₂` (2-minute range outperforms stdev). 

**The σ mechanism of our "timidity."** Backing σ out of the MM mid (`σ_imp = (F−F₀)/(√τ · Φ⁻¹(mid))`, 36k points) gives median **σ_imp = 5.21** $/√s versus our deployed **σ = 6.06** (ratio 0.82) — i.e. *our* σ is too large, pushing our fair toward 0.50 (too timid). The MM's implied σ tracks **realized variance RV (4.28), not jump-robust bipower BV (2.93)** — `σ_imp ≈ 1.1·RV`. The MM therefore prices in jumps plus a ~20% premium; our range-proxy over-estimates relative to it. Matching σ to ~1.1·RV would align our fair to the MM, but (see §6) this yields **no edge** — it merely reproduces an already-calibrated quote.

### 4.3 Calibration to resolution

Over 404 slots, the **MM mid is better calibrated than our best fair**: Brier 0.2011 (MM) vs 0.2089 (ours); the gap is stable, not noise. The same holds for ETH (MM mid Brier 0.166). The MM's *ask* is calibrated to the realized win-rate (see the spread-illusion result, §6.4). In short, the MM solves the pricing problem correctly; there is no static mispricing to fade.

### 4.4 Replication and staleness

A frozen card replicates the MM mid to ~oracle-σ accuracy at multi-second horizons. The only systematic deviation is **transient staleness**: ~19 segments totalling ~9.2 minutes where the quote lags its own model. These are the latency episodes of §5 — real, but unexploitable.

---

## 5. Latency and microstructure

### 5.1 Feed→book lead

On full-tick May data we measured, per spike (fair move ≥ 4c within 2 s), the time between the feed crossing +2c and the book mid crossing +2c (n = 1014):

- Feed leads the book on **73%** of spikes; median lead **320 ms**.
- **43% of spikes lead by > 400 ms; 26% by > 800 ms.** The distribution is fat-tailed: the MM is genuinely slow on a large minority of large spikes.

### 5.2 Why it is not capturable (taker)

A live test (75 fires) found our fill lands ~350 ms after detection — dominated by the ~250 ms server-side taker delay — versus a median book reprice ~213 ms after the trigger. We are therefore ~137 ms too slow at the median: the clean (still-stale) capture window covers only ~13% of fires, and the +2c price cap **misses 52%** of fires, which are precisely the winners (adverse selection).

A capture simulation confirmed the trap. With a *forward-looking* spike trigger (knowing the move would reach 4c), taker capture shows +1.5c/share at 350 ms latency. But the trigger is look-ahead. With a **causal** trigger (fire when the past 1 s moved ≥ threshold), net is **−0.6c to −1.4c** (CI below zero): in real time we cannot select the slow-MM spikes, because by the time a move is large enough to identify, the lag is consumed or the move has reverted. (§6/§7.)

### 5.3 Order-flow imbalance is mechanical, not informed

Queue imbalance `QI = (bid_size − ask_size)/(bid_size + ask_size)` does **not** lead the feed: the cross-correlation `corr(QI(t), F(t+k)−F(t))` peaks at **k = −1.4 s** (QI reflects the *past* feed move), with negligible forward correlation (+0.03) and a clean placebo. The book follows the feed; there is no anticipatory informed flow to ride.

### 5.4 Exit symmetry is also dead

The exit-side feed lead flattens rather than reverses (≥55% of spikes never retrace ≥$3); the book self-soaks via mean reversion. A reactive trailing stop is the latency-robust exit, but it captures no directional alpha.

---

## 6. A catalogue of tested-and-rejected edges

Each row is an edge that looked positive at some stage and was rejected on verification.

| # | Hypothesis | Apparent signal | Why it died |
|---|---|---|---|
| 6.1 | **Directional hold-to-resolution** (buy below fair, hold) | in-sample +EV at ≥12c | Market efficient; MM Brier < ours; placebo +0.019; cross-log inconsistent. |
| 6.2 | **Taker latency-arb** (lift stale ask) | book stale 213 ms | Fill 350 ms (250 ms server delay); 52% miss = winners; causal sim −0.6c. |
| 6.3 | **Spike-scalp** (+ trailing) | +5–6c "reprice" | Latency-naive: reprice window ≈ POST latency; realistic net −2.5c. |
| 6.4 | **Reverse favourite-longshot** (late-slot favourite under-priced) | +9c residual **vs mid**, OOS-replicated, symmetric | **Spread illusion**: realized win-rate 0.675 ≈ **ask** 0.679. You pay the ask, not the mid; net at-ask −1.94c. The MM ask is calibrated. |
| 6.5 | **Split-sell + profit-lock** | backtest +$1.87/slot | **Overfit**: forward −$1.64; first-60s variant ~breakeven (+$0.2–0.3/slot, noisy). |
| 6.6 | **Passive market making / continuous quoting** | spread capture | Adverse selection; inventory sticks; not in LP-rewards pool. Incumbent-MM PnL ≈ +0.485c/share but CI [−176,+1055]/slot — thin and high-variance; we are a worse pricer. |
| 6.7 | **Slot-start cheap side** (MM pinned to 0.50) | premise true (flip 7%→1.4%) | No edge; MM calibrated at every t_off (multi-session realized−mid = −0.29c). |
| 6.8 | **ETH (less liquid)** | buy-cheap +0.18; Brier 0.166 | **Trend artifact**: side-split asymmetric (cheap-UP +0.30, cheap-DN −0.01); edge collapses 17→29 slots. |
| 6.9 | **Dependent-market Σ=1 arbitrage** | Σ deviations up to 30× | **Mis-grouping**: non-exclusive prop/advance markets. The one valid negRisk event deviates 2.5c (sub-fee); the negRisk AMM already arbitrages true partitions. |

### 6.10 Literature-derived hypotheses (six, via a multi-agent research workflow)

A parallel literature-research workflow generated six citable, testable hypotheses; five were tested verifier-first (the sixth, a Kou jump-diffusion *form* change, was predicted by the workflow itself to be replica-refinement, not edge):

- **H1 — surprise sign-flip** (continuation at moderate surprise, reversion at high surprise, normalised by σ√τ). *Result:* no sign-flip; `sign(s)·Δmid` is monotone-positive (+3c→+16c→+39c) — i.e. the known, uncapturable MM-lag continuation. Placebo-clean, both halves. **Dead.**
- **H2 — OFI/microprice lead.** *Result:* QI follows the feed (§5.3). **Dead.**
- **H3 — jump-robust σ.** *Result:* mechanism confirmed (our σ too large; MM ≈ 1.1·RV) but matching σ only reproduces the calibrated quote. **Mechanism, not edge.**
- **H4 — reverse favourite-longshot at slot-end.** *Result:* spread illusion (§6.4). **Dead.**
- **H6 — latency-immune post-shock slow correction** (enter 2–5 s after the shock, hold). *Result:* fading the spike loses −6c (CI below zero), worse for larger spikes; momentum also negative. The price is already fair 3 s post-shock. **Dead.**

---

## 7. Methodology: verifier-first research and an artifact taxonomy

The central methodological lesson: **a proxy metric (in-sample PnL, residual-vs-mid, forward correlation) is not the verifier.** The verifier is out-of-sample, cost-inclusive, placebo-controlled net PnL with a slot-clustered confidence interval. Repeatedly, the proxy was positive and the verifier was zero or negative.

### 7.1 The artifact taxonomy (each independently produced a false edge)

1. **Look-ahead / forward-selection.** Defining an event using future data (a spike "that reaches 4c in the next 2 s") and entering at its onset cherry-picks winners. Caught by re-running with a strictly causal (past-window) trigger: +1.5c → −0.6c (§5.2).
2. **Spread illusion.** A residual measured against the *mid* is not tradeable; you transact at the *ask/bid*. The favourite "under-priced by 9c vs mid" had realized win-rate equal to the ask (§6.4).
3. **Trend skew.** A directional drift over the sample makes one side's favourites win more; a pooled statistic reads as an edge. Caught by **side-split symmetry** (UP-favourite vs DN-favourite must agree) — this killed the ETH buy-cheap edge (§6.8).
4. **Single-session noise.** "Mid-slot favourites win +4.5c" in one session became −0.29c (perfectly calibrated) across many sessions. Caught by **n-stability** (does the edge collapse as slots accumulate?).
5. **Selection bias.** Resolving on decisive/market-settlement labels rather than the Chainlink anchor manufactures +0.083 where the correct label gives −0.026.

### 7.2 The verifier protocol

Every candidate must pass, in order: (i) **placebo** (shuffle the signal → effect → ~0); (ii) **side-split symmetry**; (iii) **n-stability** (no collapse as data grows); (iv) **chronological OOS** (fit on early data, freeze, test on later); (v) **cost-inclusive net at the executable price (ask/bid) with the taker fee**; (vi) **slot-clustered bootstrap CI excluding zero**. A point estimate without these is treated as noise.

### 7.3 Tooling

Reusable single-file analyses: `mm_card.py` (MM replication), `spike_lead.py` / `latency_capture(_causal).py` (latency), `jump_sigma.py` (σ decomposition), `ofi_lead.py` (microstructure), `surprise_signflip.py`, `reverse_flb.py` / `favorite_late.py`, `post_shock.py`, `mm_pnl.py` (incumbent profitability from trade-prints), `calib_framework.py` / `calib_by_second.py` (calibration), plus a slot-review viewer (`ui/slot_review.html`) with full-tick raw-stream inspection.

---

## 8. Synthesis: the 5-minute crypto market is efficient

The evidence converges from every direction:

- **Pricing:** the MM is a correctly-specified Brownian-probit digital pricer with realized-variance σ; its mid and ask are calibrated to the Chainlink resolution (§4).
- **Latency:** a real feed→book lag exists but is mechanical and uncapturable under the 250 ms server-side taker delay (§5).
- **Microstructure:** order flow is reactive, not informed (§5.3).
- **Cross-section:** ETH (less liquid) and dependent markets are equally efficient once artifacts are removed (§6.8–6.9).
- **Cost wall:** the bid–ask spread plus `p(1−p)·0.07` taker fee is exactly the apparent magnitude of every "edge" — i.e. the apparent edges *are* the spread (§6.4).

The only genuinely positive quantity we measured is the **incumbent MM's thin liquidity-provision margin** (~+0.485c/share on enormous volume, high variance) — a market-making business we cannot profitably contest from a retail position (worse calibration, no queue priority, no rewards pool).

**Conclusion.** Within the retail-accessible action space (taker entries, small passive maker orders, free CTF split/merge), Polymarket's 5-minute crypto binaries admit **no durable, capturable edge.** This is a strong, multiply-confirmed negative result.

---

## 9. Implications and future directions

- **The only lever that ever existed was latency**, and it requires both a fast continuous external feed and an MM that lags it — present in crypto, but neutralised by the server-side taker delay. Event/sports/geopolitical markets have no such feed; their edge would be superior *modelling*, which the liquid order books (1c spreads) already price efficiently.
- **Directions requiring an operator decision (not pursued autonomously):**
  1. **Different venue/horizon** — Kalshi, or longer-horizon / lower-liquidity markets where modelling edges may survive; requires API/auth integration.
  2. **Paid market-making** — daily commodity/FX up/down markets *are* in the rewards pool; the edge is the rebate, not direction; requires MM infrastructure and inventory risk management.
  3. **Price-ladder monotonicity arbitrage** — nested "above $X" thresholds must be monotone; violations (likely only in illiquid rungs) are risk-free but size-limited.
- **What this study contributes regardless of outcome:** a validated MM model card, a latency map, and — most portably — the **verifier-first protocol and artifact taxonomy** of §7, which apply to any short-horizon prediction-market edge search.

---

## Appendix A — Key quantitative results

| Quantity | Value | Source |
|---|---|---|
| MM functional form | `Φ((F−F₀)/(σ√τ))`, R²=0.92 | mm_card, 380 slots |
| Feed | mean(Coinbase, Binance), ~300 ms | exclusive falsification |
| MM Brier vs ours | 0.2011 vs 0.2089 (404 slots) | calib_check |
| σ implied (MM) / deployed (ours) / RV / BV | 5.21 / 6.06 / 4.28 / 2.93 | jump_sigma, 36k pts |
| Feed→book lead >400 ms / >800 ms | 43% / 26% (median 320 ms) | spike_lead, 1014 spikes |
| Taker delay / our fill / book reprice | 250 ms / 350 ms / 213 ms | live, 75 fires |
| Latency capture: forward / causal | +1.5c / −0.6c per share | latency_capture(_causal) |
| Reverse-FLB: residual-vs-mid / net-at-ask | +9c / −1.94c | reverse_flb, favorite_late |
| Split-sell: backtest / forward | +$1.87 / −$1.64 per slot | ss_walkforward |
| Incumbent MM PnL | +0.485c/share, CI [−176,+1055]/slot | mm_pnl, 6.2M shares |
| Taker fee | `p(1−p)·0.07` USDC/share | — |
| Server-side taker delay | ~250 ms, all crypto up/down | market scan |

## Appendix B — Data inventory

- ~978 BTC + ~33 ETH healthy slots (~84 h) after hygiene filters.
- May full-tick event-logs: 35 files, ~3.7 GB (per-source ms ticks + book + Chainlink).
- June panels: 1 Hz model panel + sub-second trade-prints + raw per-event ticks (added 2026-06-17).
- Resolution label: Chainlink boundary tick (`priceToBeat`), verified against Gamma `eventMetadata`.

## Appendix C — Glossary

- **Slot** — one 5-minute market.
- **t_off** — seconds since slot start (0–300); **τ = 300 − t_off**.
- **F, F₀** — feed price and its slot-start value.
- **fair / mid / ask** — model probability / book midpoint / best ask.
- **CL anchor** — Chainlink price-to-beat defining resolution.
- **RV / BV** — realized variance / jump-robust bipower variation.
- **Verifier-first** — accept an edge only after placebo + side-split + n-stability + OOS + cost-inclusive net + slot-clustered CI.

---

*Prepared from the project research log and memory. A negative-result paper: the contribution is the rigour of the rejection and the reusable methodology, not a trading strategy.*
