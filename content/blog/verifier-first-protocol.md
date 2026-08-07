---
title: "The verifier-first protocol"
slug: "verifier-first-protocol"
date: "2026-06-20"
summary: "Five different 'edges' in Polymarket's 5-minute crypto markets, and the three tests that killed all of them."
tags: ["methodology", "markets"]
readingTime: "~5 min"
---

I spent several weeks looking for a tradeable edge in Polymarket's 5-minute crypto binary markets. The [whitepaper](/writing/polymarket-5min-microstructure) has the full effort. No edge survived verification. What I want to write down here is the order of work that produced that answer.

## The trap

Sit down with a few weeks of tick data, ask whether there is a pattern you can trade, and you will find one. You will find five.

The first was a +6.4c anomaly near slot boundaries. The second, a +9c trend-continuation signal. The third, a passive market-making strategy that backtested to +1.5c per round trip. None of them were real, and each fell apart differently:

- Look-ahead from a 1 Hz panel that quietly used the close of bar `t` to label decisions made at the start of bar `t`.
- A fill price taken from the mid rather than the quote a taker would actually have hit.
- A test set that covered only an UP regime.
- One overnight session with a single large winning slot and too few trades to be anything but noise.

After three or four of these I changed my work order.

## The rule

> A finding is not a finding until an independent verifier, built before the search began, confirms it.

The verifier is separate code from the search. It loads a slot, applies the candidate strategy, computes P&L with realistic costs, and returns a number. It knows nothing about why you think the strategy should work.

The search produces candidates. The verifier kills them.

You write the verifier first, on a small sample with a known answer. Passive maker on a flat day should lose roughly the spread per trade — confirm that it does. Only after the verifier reproduces the boring baseline do you let yourself go looking.

## What the verifier must do

Three properties, in order of how often I got them wrong:

1. **Out-of-sample by default.** Search set and verify set come from disjoint time ranges, and the verify set is held out before the search starts. No peeking.
2. **Cost-inclusive.** Spread as paid, not as observed. Taker fees, slippage on the fill, the execution delay — about 250 ms server-side on Polymarket. A P&L number without these is fiction.
3. **Placebo-comparable.** Run the same strategy on label-shuffled data. If the placebo earns what the real signal earns, the signal is noise.

Skip one and you get a +5c edge. Apply all three and you get the negative result.

## Why the negative result was worth having

If I had published the +6.4c boundary anomaly from week one, I would have spent two months chasing it and probably cost a reader money. Catching it took a one-week detour to build the verifier.

The other thing it bought me is a map of where not to look. After the study I know that the dominant market maker is calibrated, that the retail-accessible book is efficient at the level of ordinary spread-and-fee economics, and that the inefficiencies that do exist — the feed-to-book lag above 400 ms — need infrastructure I do not have.

## Reading someone else's study

Four questions, thirty seconds:

- Is there an explicit train/test split?
- Are costs included, with numbers?
- Is there a placebo of any kind? Shuffle the labels, reverse time, swap the asset.
- Is the conclusion smaller than the title?

Three missing and it is a search artifact, however elegant the maths.

This is not specific to microstructure. Most "I found a pattern in X" claims I have run into, in physics as much as in trading, come apart under those three tests.
