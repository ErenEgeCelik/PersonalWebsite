---
title: "Low-latency multi-venue data infrastructure"
slug: "infra"
order: 4
kicker: "Infrastructure"
year: "2026"
period: "2026 — present"
role: "Builder and operator"
stack: "Python, asyncio, WebSockets, EIP-712, AWS Ireland & Virginia, Hetzner, Tailscale"
short: "The substrate under both trading systems: direct exchange feeds, a five-machine mesh, and a fire path measured down from ten seconds to 58 ms."
summary: "Direct WebSocket feeds from four exchanges, a Chainlink oracle relay and the Polymarket CLOB, time-aligned and logged across five machines placed by measured latency. Roughly 24 GB of tick data recorded, and a fire path taken from ~10 s naive to ~58 ms."
tags: ["WebSockets", "Latency", "Distributed systems", "AWS"]
---

## Why build it

Every model in the other projects needs the same thing: clean, timestamped, multi-venue data with known latency characteristics. Aggregator APIs hide exactly the milliseconds the research is about, so every feed here is direct — and every event carries both the venue's timestamp and a local receive timestamp, because the pair is what makes latency analysis possible after the fact.

## Where it runs, and why

Five machines, each placed for a measured reason rather than a guessed one.

| Location | Role | Rationale |
|---|---|---|
| AWS Ireland | Execution, orderbook recording | ~25 ms RTT to the Polymarket CLOB |
| AWS Virginia | NOAA scraper | ~5 ms to the source against ~181 ms from Turkey |
| Hetzner Istanbul | Second scraping IP | Independent rate-limit budget |
| İzmir (home Linux box) | Inference engine, 24/7 analysis | A Turkish residential IP survives rate limits that ban datacentre ranges |
| Laptop | Development | — |

They mesh over Tailscale, with the execution node also reachable on a public address so a mesh outage cannot block trading. The home box runs the heavy work continuously — Monte Carlo, posterior updates, trigger generation — and pushes signals to Ireland over a WebSocket feed; Ireland listens, receives, and fires.

## The fire path

Naive order submission took **10,163 ms**. Measured, it came down to **~58 ms** — a 175× improvement, and the single largest execution gain in any of these projects. It came from removing things rather than adding them:

- **Pre-signing EIP-712 orders at arm time**, so the critical path is a bare HTTP POST (~24 ms) rather than a signature plus a POST.
- **Warming the tick-size, neg-risk and fee-rate caches** before the event window — worth roughly 470 ms off the path.
- **Removing a blocking order-status poll** that turned out to be the dominant term all along.
- **A 4-second keep-alive loop**, because cold HTTP calls averaged 878 ms against ~172 ms on a persistent connection.
- **Not polling balances**, deliberately: that endpoint is 5–30 s stale, so reading it buys nothing and costs latency.

Decision-to-post sits at 0.1–0.2 ms; the order POST round trip at ~30 ms.

## Tail latency is the real problem

A single scraping IP showed a persistent p99 near 1,500 ms and one 5,031 ms outlier — during which the market repriced and the order came back unmatched. The fix was not a faster host, because there isn't one: polling the same source from two independent IPs and taking the first arrival, deduplicated on the observation's own timestamp, removed the tail. Live logs show the winner alternating between hosts by 209 ms, then 113 ms, then −7 ms. Neither host is reliably faster. The pair is what removes the tail.

Sustained polling at ~166 requests per second got a datacentre IP banned for hours; the residential IP under identical load was throttled but not banned. So bursts are confined to the publication window and the system idles outside it — rate limits treated as a design constraint rather than an obstacle.

## Orderbook state

Polymarket's WebSocket sends full book snapshots plus incremental deltas. The deltas carry no top-level asset identifier — the identifiers sit inside the change array, because the YES and NO legs of a binary market are coupled and one order emits two entries. An implementation that filters on the top-level field silently drops every delta and never knows it. With that handled, the reconstructed book validates at 99–100% top-of-book agreement against independent REST snapshots.

## Safety

The risk layer was written after a loss, not before one: a single-market strategy re-fired every four minutes with nothing to stop it and lost about $80. What followed was per-market circuit breakers, daily spend caps, fire-count limits, an inventory clamp, a dead-man switch on book silence, a feed-staleness kill switch, and fail-safe defaults throughout — a stale feed means no new positions, a missing model feed means skip rather than assume, an unknown state means do nothing. Live submission raises unless an explicit environment flag is set, and post-only is mandatory with an abort if the venue reports taker behaviour.

## Scale

Roughly 24 GB of tick-level market data recorded across the projects — about 19 GB of crypto tapes and ~5 GB of weather and football orderbook data, with journal streams running to ~500 MB per market-day at peak. All of it replayable, which is what made the negative-result measurements possible at all.
