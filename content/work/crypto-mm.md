---
title: "Market efficiency in Polymarket's 5-minute BTC markets"
slug: "crypto-mm"
order: 3
kicker: "Research · Polymarket"
year: "2026"
period: "June – July 2026"
role: "Independent researcher"
stack: "Python, numpy, asyncio, multi-venue WebSockets, AWS"
venue: "Polymarket — BTC/ETH 5-minute binary contracts, resolved on the Chainlink oracle"
short: "Reverse-engineered the dominant market maker to R² 0.92, derived my own fair value, then killed every candidate edge with placebo and out-of-sample tests. The market is efficient at the level I can reach."
summary: "A market-microstructure study of Polymarket's most competitive market. I reverse-engineered the incumbent market maker's pricing to R² 0.92, derived a fair value and an inventory-skew rule from first principles, then killed every candidate edge with out-of-sample, placebo and cost-inclusive tests. The market is efficient at the retail-accessible level, and the binding constraint is queue position rather than model quality."
tags: ["Microstructure", "Falsification testing", "Market making", "MDP"]
paper: "/writing/polymarket-5min-microstructure"
---

## The question

Polymarket lists a binary contract every five minutes on whether BTC finishes above where it started, resolved mechanically against the Chainlink oracle. One participant quotes nearly all of them. The question I set out to answer was narrow and falsifiable: **is there edge here that a retail participant can actually reach?**

Most projects in this space answer that question with a backtest. A backtest is an upper bound, not a result — so the design principle throughout was the opposite of the usual one. *Tape only kills.* A positive simulation was never allowed to be a green light; it could only fail to rule something out.

## Reverse-engineering the incumbent

If one maker prices every contract, its quotes are a function of something. Finding out what turns an opaque counterparty into a model you can reason against.

I logged its quotes alongside every candidate input — Binance, Coinbase, Kraken, Bitstamp and the Chainlink oracle relay — and ran exclusive falsification tests: propose a feed composition, then search the tape for a window where that composition *must* produce a quote the maker did not post. Compositions that survive every attempt to kill them are the ones left standing.

The surviving composition replicates its quotes at **R² 0.92 over 380 slots**, roughly six ticks out of sample. It is also better calibrated than my own first attempt: measured against realised outcomes over 404 slots, the incumbent scored a Brier of 0.2089 against my 0.2011 — close enough that "the incumbent is good at fair value" became an explicit axiom of everything built afterwards, rather than an assumption left implicit.

## Deriving the quote

For a binary contract on whether a Brownian price finishes above a strike, fair value is a probit in the scaled distance to the strike:

$$
\text{fair} = \Phi\!\left(\frac{F + \text{offset} - \text{anchor}}{\sigma\sqrt{\tau}}\right)
$$

with Chainlink-lag compensation in the offset and volatility from trailing 15-minute realised vol. Deriving it rather than fitting it means every input enters where the model says it should, and every parameter you fit instead of derive is a place a bad assumption can hide.

The inventory skew follows the same discipline: Avellaneda–Stoikov adapted to binary payoffs in logit space, where the optimal quote shift has a closed form in risk aversion, inventory and payoff variance. It explains the asymmetric quoting visible in the book far better than an ad-hoc skew parameter does.

## Where the edge actually lives

The result that reframed the project came from the fill model. I fitted a hazard/survival form,

$$
A = 1 - \exp\!\left(-\,k\,\lambda\,T / r_0\right)
$$

and the pure-flow version — fills as a function of trailing order flow alone — was **killed by a matched placebo**. What survived puts the information in $r_0$: **queue depth ahead of you**, not flow past you.

That is not a modelling result, it is a structural one. The incumbent supplies enough liquidity for the flow that arrives, so my orders were never far enough forward in the queue to collect the spread. Widening to the 15-minute and 1-hour markets does not help; it trades a queue problem for a flow problem. The binding constraint is queue priority, and no amount of model quality moves it.

## Verification

The methodology is the part I would defend hardest, and it is deliberately hostile to its own conclusions:

- **Slot-cluster bootstrap** — clustering at the slot level rather than at the fill level, because fills within a slot are anything but independent.
- **Matched-frequency placebos** — a fake signal firing at the same rate as the real one. If the placebo earns too, the signal earned nothing.
- **Chronological 70/30 out-of-sample splits** — never random splits, which leak across a time series.
- **Pre-declared definitions** — the methods document was written before the results existed.
- **An explicitly unmeasurable parameter, swept honestly.** Adverse selection α cannot be measured from my own data. Rather than pick a flattering value, it is carried as a free parameter with a breakeven α\* and confidence intervals, so a reader can see exactly how much of the conclusion rests on it.

The strategy itself is a regime-conditional MDP over (regime, queue, inventory, time), quoting a side only when its conditional expected value is positive. The MDP is there to find the ceiling, not the policy: the best achievable if every decision were perfect.

## The blind-spot test

The single most useful thing I ran was designed to embarrass the rest.

Tape simulation credited **+123.5 c/slot** on exactly the weekend the live arm lost **$31**. Quantifying that gap put the sim-to-live overstatement at roughly 60–130 c/slot in normal conditions and up to ~850 c/slot in violent regimes. The conclusion I wrote down was that positive backtests carry *zero* go-live weight in violent regimes.

The surviving design earned **+$1.07 per slot over a 555-slot paper campaign** with a 90% confidence interval excluding zero, and cut the adverse-fill rate from 65% to 34%. That figure is paper-traded, and after the blind-spot test I do not treat it as a live expectation. The live A/B that would have settled it — 157 matched slots on a VPS, base engine against the EV model — came back **inconclusive** (Δ +22.7 c/slot, ci90 [−16.7, +61.4]) and I stopped it there rather than running until it said something flattering.

Real-money exposure never went past a five-trade, $2-per-trade taker test that finished around breakeven. This project never traded at scale, and its result is not a P&L.

## What it is and isn't

It is a market-efficiency study with a defensible negative answer: at the retail-accessible level, this market is efficient, and I can name the mechanism — queue priority against a liquidity-rich incumbent.

It is not a profitable trading system, and framing it as a bot that "didn't work" would misdescribe it in the other direction. Knowing *why* a market cannot be traded from where you stand is a result. Working through it end to end — the resolution mechanics, the feeds and their relative latencies, how quotes behave around a forced repricing, where informed flow shows up — left me able to think about these instruments from the maker's side rather than only the taker's.

Where I am incomplete is optimisation. Knowing a book should move after flow arrives is not the same as knowing how far to move it, how to skew toward the side more likely to be right, or how to separate informed takers from uninformed ones in real time. Those are the questions I would most want to work on, and they are not ones I can answer alone from a residential connection with a four-figure account.
