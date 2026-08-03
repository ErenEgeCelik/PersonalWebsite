---
title: "Binary market making under CARA utility"
slug: "binary-mm"
order: 4
kicker: "Research · Derivation"
year: "2026"
period: "2026"
role: "Independent researcher"
stack: "Python, first-principles derivation"
short: "Fair value and inventory skew for binary contracts, derived from first principles rather than fitted."
summary: "A Brownian-probit fair value and a binary inventory-skew rule derived from scratch, validated on logged market data at a within-slot R² of about 0.92 — then stress-tested as an MDP until it told me its own ceiling."
tags: ["CARA utility", "Inventory skew", "MDP"]
---

## Fair value

For a binary contract on whether a Brownian price finishes above a strike, fair value is a probit in the scaled distance to the strike. Deriving it rather than fitting it means every input — spot, time remaining, volatility — enters where the model says it should. Against logged data the within-slot fit lands at R² ≈ 0.92.

## Inventory skew

Under CARA utility the optimal quote shift for a binary payoff has a closed form: risk aversion times current inventory times the payoff variance. It falls out cleanly, and it explains the asymmetric quoting you see in the book far better than an ad-hoc skew parameter does.

## Adverse selection

Fair value and skew set the quote; adverse selection decides whether you keep the edge. I measured post-fill drift to separate informed flow from noise and priced the difference into the spread.

## The negative result

Formalizing the strategy as a Markov Decision Process let me stress-test its structural limits. The binding constraint turned out to be queue-priority inaccessibility, not model quality: at the top of the book I cannot get, the edge is real; at the depth I can reach, it isn't. I published that verdict rather than the backtest that would have looked better.
