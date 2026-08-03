---
title: "Low-latency multi-venue data infrastructure"
slug: "infra"
order: 5
kicker: "Infrastructure"
year: "2026"
period: "2026 — present"
role: "Builder"
stack: "Python, WebSockets, AWS (Ireland)"
short: "Direct exchange feeds, an oracle relay and the Polymarket CLOB, time-aligned and logged."
summary: "Direct WebSocket feeds from Binance, Coinbase, Kraken and Bitstamp, a Chainlink oracle relay, and the Polymarket CLOB — logged, time-aligned, and deployed close to the venue."
tags: ["WebSockets", "AWS", "CLOB / REST"]
---

## Why build it

Every model above needs the same thing: clean, timestamped, multi-venue data with known latency characteristics. Aggregator APIs hide exactly the microseconds the research is about, so the feeds are direct.

## What it does

Four exchange WebSocket feeds, a Chainlink oracle relay and the Polymarket CLOB, normalized to a common event schema and written to disk with local receive timestamps as well as venue timestamps — the pair is what makes latency analysis possible after the fact.

## Where it runs

Deployed on AWS in Ireland, chosen for round-trip time to the venues that matter. Trading from Turkey over consumer internet was itself a measurable cost; moving the process removed it.
