---
title: "The verifier-first protocol"
slug: "verifier-first-protocol"
date: "2026-06-20"
summary: "A short note on the discipline that turned five different 'edges' into negative results — and why that's the actually useful output of a market study."
tags: ["methodology", "markets"]
readingTime: "~5 min"
---

I spent several weeks searching for a tradeable edge in Polymarket's 5-minute crypto binary markets. The [whitepaper](/whitepapers/polymarket-5min-microstructure) documents the full effort. The headline result is negative: no edge survives proper verification. The transferable lesson is the protocol that produced that negative result.

This is a short note on what "verifier-first" means in practice, and why I think it's the only sane way to do this kind of work.

## The trap

When you sit down with a few weeks of tick data and ask "is there a pattern I can trade?", you will find one. You will find five.

The first edge I found was a +6.4c "anomaly" near slot boundaries. The second was a +9c "trend continuation" signal. The third was a passive market-making strategy that backtested to +1.5c per round-trip. None of them were real.

Each one fell apart in a different way:
- Look-ahead from a 1Hz panel that quietly used the close of bar `t` to label decisions made at the start of bar `t`.
- Spread illusion — the "fill price" used in PnL was the mid, not the actual quote a taker would have hit.
- A trend-skewed sample where the test set covered only an UP regime.
- A single overnight session that happened to have one big winning slot and not enough trades to be anything more than noise.

After three or four of these I changed my work order.

## The rule

> **A finding is not a finding until an independent verifier — built before the search began — confirms it.**

The verifier is a separate piece of code from the search. It loads a slot's data, applies the candidate strategy, computes PnL with realistic costs, and returns a number. It knows nothing about *why* you think this strategy should work.

The search produces candidates. The verifier kills them.

You write the verifier first. You write it on a small, deliberately chosen sample with a known answer (e.g. "passive maker on a flat day should lose roughly the spread per trade — confirm"). You only let yourself search for edges *after* the verifier reproduces the boring baseline.

## What the verifier must do

Three properties, in order of how often I screwed them up:

1. **Out-of-sample by default.** The search-set and the verify-set come from disjoint time ranges. The verify-set is held out before the search starts. You can't peek.
2. **Cost-inclusive.** Bid-ask spread *as paid*, not as observed. Taker fees, slippage on the fill, the execution delay (in Polymarket's case, ~250 ms server-side). A PnL number without these is fiction.
3. **Placebo-comparable.** Run the same strategy on a label-shuffled version of the data. If the placebo "edge" is the same size as the real edge, the edge is noise.

Skip any one of these and you get a +5c edge. Apply all three and you get the negative result.

## Why negative results matter

Negative results are the actually useful output of this kind of work — both for you and for anyone else thinking of trying it.

If I had published the +6.4c "boundary anomaly" I'd found in week one, I'd have wasted two months of my own time and probably some readers' money. Catching it cost a one-week detour to build a proper verifier. That's a great trade.

The other thing negative results do: they tell you what the market *isn't*. After the Polymarket study, I know with high confidence that:
- The dominant MM is calibrated.
- The retail-accessible book is efficient at the level of standard spread-and-fee economics.
- The microstructure inefficiencies that *do* exist (the >400ms feed-to-book lag) require infrastructure I don't have.

That's a complete map of where I shouldn't spend the next month. The map is worth more than the failed search.

## Smell test

If I'm reading someone else's market study and I want to know in 30 seconds whether to trust it, I look for:

- Is there an explicit train/test split?
- Are costs included with specific numbers?
- Is there a placebo? (Any kind. Shuffle the labels, reverse the time, pick a different asset.)
- Is the conclusion smaller than the title?

If three of these are missing the paper is a search artifact regardless of how elegant the math looks.

I think this generalises beyond market microstructure. Most "I found a pattern in X" claims I've seen — in physics, in computing, in trading — fall apart on a verifier with these three properties. The discipline transfers; the verifier is task-specific.
