---
title: "Low-latency multi-venue data infrastructure"
slug: "infra"
order: 4
kicker: "Infrastructure"
year: "2026"
period: "2026 — present"
role: "Builder and operator"
stack: "Python, asyncio, WebSockets, EIP-712, AWS Ireland & Virginia, Hetzner, Tailscale"
short: "Five machines placed by measured latency, a fire path taken from 10,163 ms to 58 ms, and ~24 GB of tick data recorded so the negative results could be measured at all."
summary: "Direct WebSocket feeds from four exchanges, a Chainlink oracle relay and the Polymarket CLOB, time-aligned and logged across five machines placed by measured latency. Roughly 24 GB of tick data recorded, and a fire path taken from ~10 s naive to ~58 ms."
tags: ["WebSockets", "Latency", "Distributed systems", "AWS"]
---

## Why build it

Every model in the other projects needs the same thing: clean multi-venue data with known latency characteristics. Aggregator APIs hide the milliseconds the research is about, so every feed here is direct.

Each event carries two timestamps, the venue's and the local receive time. That pair is what makes latency analysis possible after the fact, and it costs nothing to record.

## Where it runs, and why

| Location | Role | Why there |
|---|---|---|
| AWS Ireland | Execution, orderbook recording | ~25 ms RTT to the Polymarket CLOB |
| AWS Virginia | NOAA scraper | ~5 ms to the source, against ~181 ms from Turkey |
| Hetzner Istanbul | Second scraping IP | Independent rate-limit budget |
| İzmir, home Linux box | Inference engine, 24/7 analysis | A Turkish residential IP survives rate limits that ban datacentre ranges |
| Laptop | Development | — |

They mesh over Tailscale. Execution is also reachable on a public address, so a mesh outage cannot stop trading. The home box runs Monte Carlo and posterior updates around the clock and pushes triggers to Ireland over a WebSocket. Ireland listens and fires.

## The fire path

Naive order submission took 10,163 ms. It now takes about 58 ms. Most of that came from taking things out:

- **Pre-signing EIP-712 orders at arm time.** The critical path becomes a bare HTTP POST, about 24 ms.
- **Warming the tick-size, neg-risk and fee-rate caches** before the event window. Worth roughly 470 ms.
- **Deleting a blocking order-status poll**, which turned out to be the dominant term all along.
- **A 4-second keep-alive loop.** Cold HTTP calls averaged 878 ms; on a persistent connection, ~172 ms.
- **Not polling balances.** That endpoint is 5–30 s stale, so reading it costs latency and tells you nothing.

Decision-to-post is 0.1–0.2 ms. The order POST round trip is about 30 ms.

## Tail latency

One scraping IP sat at a p99 near 1,500 ms with a single 5,031 ms outlier. During that outlier the market repriced and the order came back unmatched.

There is no faster host to move to. What worked was polling the same source from two independent IPs and taking whichever arrives first, deduplicated on the observation's own timestamp. Live logs show the winner alternating between hosts by 209 ms, then 113 ms, then −7 ms. Neither host is reliably ahead. Racing them removes the tail.

Sustained polling at ~166 requests per second got a datacentre IP banned for hours. The residential IP under the same load was throttled but stayed up. So bursts are confined to the publication window and the system idles outside it.

## Orderbook state

Polymarket's WebSocket sends full book snapshots plus incremental deltas. The deltas carry no top-level asset identifier; the identifiers sit inside the change array, because the YES and NO legs of a binary market are coupled and one order emits two entries.

An implementation that filters on the top-level field drops every delta and never reports an error. Once that was handled, the reconstructed book agreed with independent REST snapshots at 99–100% on top of book.

## Safety

I wrote the risk layer after a loss, not before one. A single-market strategy re-fired every four minutes with nothing to stop it and lost about $80.

What exists now: per-market circuit breakers, daily spend caps, fire-count limits, an inventory clamp, a dead-man switch on book silence, and a feed-staleness kill switch. Defaults fail closed. A stale feed means no new positions. A missing model feed means skip, never assume. Live submission raises unless an environment flag is set explicitly, and post-only is mandatory with an abort if the venue reports taker behaviour.

## Scale

About 24 GB of tick-level market data across the projects: roughly 19 GB of crypto tapes and 5 GB of weather and football orderbook data, with journal streams reaching ~500 MB per market-day at peak. All of it replays, which is the only reason the negative-result measurements were possible.
