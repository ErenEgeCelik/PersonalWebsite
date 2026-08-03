---
title: "Reverse-engineering a prediction market maker"
slug: "market-maker"
order: 3
kicker: "Research · Polymarket"
year: "2026"
period: "2026 — present"
role: "Independent researcher"
stack: "Python, WebSockets, AWS"
venue: "Polymarket — BTC 5-minute binary contracts"
short: "Working out which price feeds a dominant market maker quotes from, by testing compositions until only one survives."
summary: "Identified the price-feed composition behind the dominant market maker on Polymarket's BTC 5-minute contracts by exclusive falsification testing, and replicated its quotes to roughly six ticks out of sample."
tags: ["Microstructure", "Falsification testing", "Python"]
paper: "/writing/polymarket-5min-microstructure"
---

## The question

If one participant is quoting nearly every BTC 5-minute contract, its quotes are a function of something. Finding out exactly which price feeds, in which proportions, turns an opaque counterparty into a model you can trade against.

## Method

I logged the maker's quotes alongside candidate feeds — Binance, Coinbase, Kraken, Bitstamp and the Chainlink oracle relay — and ran exclusive falsification tests: propose a feed composition, and search for a window where it must produce a quote the maker did not post. Compositions that survive every attempt to kill them are the ones left standing.

## Result

The surviving composition replicates the maker's quotes to about six ticks on data it never saw, with volatility dynamics accounted for separately. That accuracy is enough to know when its quote is stale relative to the underlying, which is the whole game on a five-minute contract.

## Written up

The full method, the volatility treatment and the out-of-sample evidence are documented in a paper — including the tests that failed on the way to the composition that didn't.
