---
title: "Weather derivatives, three edges deep"
slug: "weather"
order: 3
kicker: "Live strategy · Polymarket"
year: "2026"
period: "April – July 2026"
role: "Independent trader"
stack: "Python, METAR, Bayesian updating, AWS"
venue: "Polymarket — daily maximum temperature markets, 28 cities"
short: "Three generations of weather-derivative strategy, each rebuilt after the market adapted to the last one."
summary: "Each edge died as market makers adapted, so I built the next one: observation latency, then a Markov decision layer over dying contracts, then a probabilistic forecast engine blending my own weather station with public forecasts and live METAR."
tags: ["Bayesian inference", "Forecasting", "Adaptation"]
# Renders content/equity.json here once it has real points. See docs/equity-chart.md.
equityChart: true
---

## How I approach a market

My working method is to try to find every variable that enters a market's pricing equation — to
see the whole set, not a convenient subset of it. Most markets make that impossible; there are too
many inputs and too many of them are unobservable.

Weather markets are unusual in that the set is small and almost entirely public. What determines the
outcome is: the official observation feed that resolves the contract, the intermediate sensor
readings that precede it, private weather stations near the station, forecast curves, the time of day
relative to the daily peak, and the market's own orderbook. That is close to complete. And because
every one of those has history, the whole thing can be calibrated against the past rather than
guessed at.

That property is why I chose these markets: they are one of the few places where a solo participant
can plausibly enumerate the variable set and then check their model against reality. This document
is the account of doing that — three successive edges, what each was worth, and how each of the first
two ended.

Over the period covered here the account grew from roughly $30 to roughly $1,200. The absolute
numbers are small and the depth available in these books is measured in hundreds of dollars; what I
think the work demonstrates is the process rather than the return.

---

## 1. The instrument

Polymarket lists a daily market for each of about 28 cities: what will today's maximum temperature
be? The answer space is a set of mutually exclusive integer buckets — `27°C`, `28°C`, `29°C` and so
on — each a binary contract.

Two structural properties matter.

**Resolution is mechanical.** The market settles on the official METAR observation from a designated
airport station: LTFM for Istanbul, EGLC for London, KORD for Chicago. METAR is the standardised
aviation weather report, published on a fixed schedule (typically twice an hour) and distributed
through public channels. There is no subjective judgment anywhere in the process — only a race about
a number that is going to become public regardless.

**The state is monotone and self-eliminating.** A daily maximum only ratchets upward. Once an
observation arrives above bucket *X*, bucket *X* is dead with certainty and its probability mass must
move to higher buckets. The day is therefore a sequence of deterministic eliminations punctuating
otherwise continuous drift, and each elimination is a discrete, forced repricing event.

---

## 2. Edge I — observation latency

The first edge was pure speed, and it came from research rather than from modelling.

METAR observations reach the public international feeds with a delay. But Turkey's state
meteorological service, MGM, publishes its own stations through the web service that backs its public
website — and that service exposes the raw METAR string in a `rasatMetar` field, timestamped, before
the same observation propagates through the international distribution that most participants watch.

Measured on Ankara: MGM carried the observation roughly **75 seconds** after observation time, while
the NOAA path carried it at roughly **five minutes** — an advantage of about **four minutes and
forty-four seconds** on the number that settles the contract.

That is an enormous head start in a market that reprices in seconds. The engineering to exploit it
was straightforward by comparison: poll the endpoint on a persistent HTTP/2-less `httpx` connection
(p50 15–37 ms from Turkey), detect the change on the METAR's own `DDHHMMz` timestamp rather than the
sensor field beside it, and fire a pre-signed order.

**How it died.** Within weeks, market makers found the same feed. What killed the edge was not that
they became equally fast, but the structure of the venue: Polymarket applies roughly a three-second
delay to taker orders in these markets. That window is enough for a maker who is watching the same
observation to pull the quote before the incoming order matches. Our orders started returning
`unmatched` — not rejected, not filled, simply arrived at a price that no longer existed. A
representative case: the Ankara 17°C contract, where the ask moved 0.45 → 0.95 while our order was in
flight and the fill came back unmatched.

Two things are worth saying about that. First, this happened well before the summer — the pure
latency edge had a short life. Second, the correct read is not "we were too slow." We were fast; the
venue's taker delay simply hands the last look to the resting side. That is a structural feature of
the market, not a latency problem to be engineered away, and recognising the difference is what
moved the project onto its second phase.

---

## 3. Edge II — the mass redistribution of a dying bucket

If you cannot win the race to the observation, the next question is what happens in the orderbook
*around* the elimination, and whether it is priced correctly.

When bucket *X* dies, its probability mass has to go somewhere. The market's response is not
instantaneous or uniform: some contracts reprice immediately, others lag, and the shape of the
redistribution depends on how much of the day is left, where the forecast peak sits, and how thin the
books are. This is a decision problem rather than a race, and it is where the algorithmic work went.

The decision at the moment of a spike is not "is the upper bucket cheap." It is a joint estimate over
several quantities at once:

| Question | Why it matters |
|---|---|
| Is this spike a genuine elimination, or a false one? | Thin books produce flickers that look identical to a death for a few hundred milliseconds. Acting on those is the dominant loss mode. |
| What is the distribution over the *next* observation? | The elimination tells you *X* is dead; it does not tell you whether the day ends at *X+1* or two buckets higher. Those are different trades. |
| How much size is actually resting in the book? | A large nominal edge on a contract with $0–40 of depth is not an edge; it is a quote. |
| If we buy, when and at what price can we exit? | Requires a model of how fast the book reprices after an event — not a constant. |
| What probability are we buying, at what price? | The only question that determines whether the trade is positive-value, and the one most easily lost behind the other four. |

Those are the state variables of a Markov decision problem, and that is how it was implemented.

**The structure.** The system carries a state
`s = (posterior temperature μ, σ², confirmed max so far, forecast curve, orderbook snapshot, open positions, time remaining)`
and chooses among BUY / SELL / HOLD actions on individual bucket contracts. Expected value is
decomposed into two conditional engines:

```
EV(action) = Σ_x  P(next observation = x)  ·  P(orderbook response | x)  ·  (payoff − cost)
                  └── forecast/posterior ──┘  └──── reaction model ────┘
```

The first term is the probability engine described in section 5. The second is a **reaction model**:
after an event, a contract's price converges from its pre-event mid toward an analytically derived
post-event fair value at an exponential rate,

```
R(p, Δt) = p_pre · e^(−γΔt) + p_post · (1 − e^(−γΔt))
```

where γ is the repricing rate — the quantitative form of "how quickly will the maker close this
spread." A confirmed elimination drives the dead bucket's NO toward 0.99; γ determines how long the
mispricing is available and therefore whether the trade is reachable at all.

Because that model exists, each candidate action is evaluated under **two exit horizons** and the
better one is chosen automatically: hold to resolution, where payoff is `Σ_Y P(Y)·payoff(Y)`, or hold
to the next event, where payoff is the reaction model's expected price at that time. Multi-position
utility is scored as `U = E[PnL] − λ·Var[PnL]`, so the engine prefers a smaller certain edge to a
larger volatile one.

This is the part of the project I would defend most strongly as trading work rather than engineering:
the decision is expressed as expected value over an explicit distribution, with execution cost,
liquidity and exit path inside the calculation rather than bolted on afterward.

---

## 4. Infrastructure

Five machines, each placed for a measured reason.

| Location | Role | Rationale |
|---|---|---|
| **AWS Ireland** | Execution, orderbook recording | ~25 ms RTT to Polymarket's CLOB |
| **AWS Virginia** | NOAA scraper | ~5 ms to the source vs ~181 ms from Turkey |
| **Hetzner Istanbul** | Second scraping IP | Independent rate-limit budget |
| **İzmir (home Linux box)** | Primary MGM scraper, probability engine, data analysis | Turkish residential IP survives rate limits that ban datacentre ranges |
| **Laptop** | Development and analysis | — |

Connected over a Tailscale mesh, with execution reachable on a public address so a mesh outage could
not block trading.

**Measured decisions, not assumed ones.** NOAA's 62-byte static text endpoint updates before the JSON
API that reads from it — p50 181 ms from Turkey against ~15–20 ms from Virginia. Cold HTTP calls
averaged 878 ms versus ~172 ms on persistent connections. Pre-signing EIP-712 orders and warming the
tick-size, neg-risk and fee-rate caches moved roughly 470 ms off the critical path. Removing a
blocking order-status poll took fire latency from **10,163 ms to 58 ms** — a 175× improvement, and
the single largest execution gain in the project.

**Tail latency.** A single scraping IP showed a persistent p99 near 1,500 ms and one 5,031 ms outlier,
during which the market repriced and the order went unmatched. Polling the same station from two
independent IPs and taking the first arrival — deduplicated on the observation's own timestamp —
removed it. Live logs show the winner alternating between hosts by 209 ms, 113 ms, then −7 ms.
Neither host is reliably faster; the pair removes the tail.

**Rate limits as a design constraint.** Sustained polling at ~166 requests per second got a datacentre
IP banned by MGM for hours; the residential IP under identical load was throttled but not banned. The
response was to confine bursts to the observation publication window and idle outside it.

**Orderbook state.** Polymarket's WebSocket sends full book snapshots plus incremental deltas. The
deltas carry no top-level asset identifier — the identifiers sit inside the change array, because the
YES and NO legs of a binary market are coupled and one order emits two entries. An implementation
that filters on the top-level field silently drops every delta. With that handled, the reconstructed
book was validated against the exchange's own interface contract-by-contract and matched exactly.

---

## 5. Understanding the system — the probability engine

The reaction model answers what the book will do. The other half is what the weather will do, and
that is a state-estimation problem.

A Kalman filter tracks a hidden continuous temperature as an AR(1) random walk pulled toward a
forecast curve. Observations update the posterior at their own frequencies and precisions:

| Source | Model | Cadence |
|---|---|---|
| METAR | `round(T) + noise` — near-exact, the anchor | 1–2 per hour |
| Private weather stations | `T + bias + N(0, σ²)`, solar-adjusted | ~5 min |
| Airport sensor feeds (MGM, MetService) | `T + N(0, σ²)` | ~10–15 min |

Monte Carlo simulation of the remaining day produces the three distributions the decision engine
consumes: the daily maximum `P_now`, the next observation `Q_next`, and the maximum conditional on
that observation `D_after`. They satisfy the Bayesian consistency identity
`Σ_m Q(m)·D_after(k|m) ≈ P_now(k)`, which served as a built-in correctness check — residual under 2%,
the remainder Monte Carlo noise.

**Peak timing.** Because the maximum is monotone, the single most valuable piece of context is how
much daylight remains and where the forecast peak sits. A separate component derives the peak hour
from forecast curves and arms the system only within that window; outside it the state is either still
climbing predictably or already settled.

**Guards.** Two failure modes needed explicit handling. A single noisy station reading could drag the
posterior and collapse its variance — one market printed a distribution asserting 100% certainty on a
bucket with hours of daylight left. I added a divergence guard that inflates observation variance when
a reading strays more than about 2.5σ from the anchor, a floor under observation noise, and a guard
that widens any distribution claiming near-certainty about a *future* maximum.

---

## 6. Quantitative work

### 6.1 Feature validation — falsifying a promising signal

Consistent with trying to see the whole variable set: the engine was using station temperature and
solar radiation but discarding eleven other fields the sensor API returns. I re-fetched the full set
over 92 days and asked which carry incremental, out-of-sample information about the day's remaining
rise — screening on correlation, then variance inflation for redundancy, then partial correlation to
strip out season, then leave-one-day-out error to catch overfitting.

Wind direction looked excellent in Istanbul: partial correlation −0.43 at p < 0.001, stable across
five decision hours, with a clean physical story — a northerly over the Bosphorus brings a cooler air
mass. I then tried to break it:

| Station | Climate | Result |
|---|---|---|
| Istanbul | Coastal, sharp air-mass boundary | Strong at every decision hour |
| Chicago | Continental, frontal | Morning only; gone by midday |
| London | Maritime, well-mixed | Absent (p ≈ 0.7) |

It did not generalise. Its value tracked local geography, and the multi-feature models that scored
best pulled a different winning set on each run — the signature of overfitting on correlated
observations. I rejected it rather than deploying it. Separately, heat index, wind chill, UV and
dewpoint proved to be deterministic functions of temperature and humidity (variance inflation up to
60,000) and carried nothing independent.

### 6.2 Calibration across 28 markets

The calibration pipeline had a structural flaw: the offline fitter never saw the forecast curve, so
the forecast-pull parameter always fit to zero, and production silently overrode it with global
constants. No market's dynamics were actually being fitted. I rebuilt the fitter to replay against
archived historical *forecasts* — deliberately not reanalysis, since using realised weather would be
look-ahead leakage — and scored candidates by Brier score.

Mean improvement across all 28 markets was about **24%**, ranging 3.5% to 49%, with no market
regressing. The fitter's own behaviour was a useful check: for one city whose forecast source carries
a 5.28°C bias, it independently chose to ignore the forecast entirely and still improved 35% over the
default.

### 6.3 Audits against observed data

- **Unit mismatch.** Six US markets resolve in Fahrenheit. The forecast drove the state in Fahrenheit
  while every observation was fed in raw Celsius — the market's unit was read once at construction and
  never used again. Those six had been running an incoherent posterior.
- **Publication schedules.** Histogramming the minute-of-hour of 40 days of observations per station
  showed five Asian markets publishing at :00 and :30 while configured for :20 and :50. Every control
  station matched, which is what made the discrepancies credible.
- **Timezones.** The fallback logic was DST-blind and assigned all US markets a fixed offset; one was
  two hours out in summer, shifting the local-day window used to compute a daily maximum.

---

## 7. Edge II, measured

By July the system was running sessions without taking trades. The tempting response was to loosen
the filters; instead I measured whether the edge still existed, using ~3.3 GB of tick-level orderbook
data recorded across 50 city-days.

The scan reconstructs every genuine elimination — a bucket that was actually alive and leading, whose
NO side collapsed to certainty within 60 seconds — and records, for each, the target contract's price
60 seconds before, its price at the moment of elimination, the time until it repriced beyond
entry + 0.10, and the day's realised outcome.

| Entry price | Events | Wins | Win rate | EV per $1 |
|---|--:|--:|--:|--:|
| ≤ 0.15 | 10 | **0** | 0% | **−1.00** |
| 0.15 – 0.35 | 6 | 1 | 17% | −0.44 |
| 0.35 – 0.60 | 6 | 1 | 17% | −0.57 |
| > 0.60 | 10 | 6 | **60%** | −0.26 |
| **All** | **32** | 8 | 25% | **−0.58** |

Three findings.

**The window has closed.** The evidence that justified this phase — a Madrid cascade in June — showed
the upper contract sitting cheap for about **23 seconds**. The median across this dataset is
**0.15 seconds**. Whatever the reaction model's γ was when the strategy was designed, it is now large
enough that a reactive strategy cannot systematically reach the mispricing.

**The cheap contracts were cheap for the right reason.** Entries at or below 0.15 went 0-for-10. The
events that won were mostly *already* priced at 0.72–0.88 at the moment of elimination. The market was
not lagging; it was correct.

**No band was profitable.** Even the 60%-win band loses money, because at 0.80 a win pays +0.25 and a
loss costs −1.00. Notably, maker pre-emptive repricing explained only 9% of cases — this was not
predatory quote-pulling, it was efficiency.

*Limitations, stated plainly:* about 22 of the 32 events are independent — ten are repeated detections
of one persistent situation. The measurement assumes holding to resolution and does not credit
intraday exits. It covers five days of summer conditions. I would not call it definitive; I would call
it sufficient to stop increasing size.

**The response.** I cut the clip from $20 to $5, tightened the maximum entry price from 0.90 to 0.35,
reduced the daily budget to the account balance, and narrowed the market set. The pre-trade filter
that had been refusing to trade turned out to have been right: on the next live session it blocked
three signals on a contract that then fell from 0.31 to 0.11.

---

## 8. Risk

- **Sizing.** Fixed clips initially, later a Kelly-lite function of estimated edge and entry price,
  bounded well below full Kelly to reflect uncertainty in the edge estimate itself.
- **Circuit breakers.** Per-market consecutive-failure limits, a daily spend cap and a maximum fire
  count — written after a session in which a single-market bot re-fired every four minutes and lost
  about $80. The failure was not the thesis; it was the absence of a stop.
- **A pre-trade filter.** A pure-orderbook gate requiring clean structure before firing: everything
  below the leader dead, no live contract above the target, the target genuinely cheap. It refuses when
  the book is ambiguous.
- **Fail-safe defaults.** Stale feed means no new positions; missing model feed means skip rather than
  assume; unknown state means do nothing.

---

## 9. Where this leaves me

Two of the three edges I found in this market are gone, and I can say precisely why each one died —
the first to a structural feature of the venue that hands last look to the resting side, the second to
straightforward efficiency, measured rather than inferred.

What remains is the third: the forecast itself. Taking a position on the day's maximum *before* the
market resolves the ambiguity, using a better-calibrated distribution than the consensus, is slower
and capacity-constrained but is not obviously arbitraged away. The calibration work in section 6 was
built toward that. I stopped before deploying it, because the honest sequence is calibrate, verify
out-of-sample, paper trade, then size — and I had completed the first step and part of the second.

**What I know and what I don't.** Working through this market end to end — the resolution mechanics,
the observation feeds and their relative latencies, the shape of the books, how quotes behave around
a forced repricing, where informed flow shows up — has left me with enough structural understanding
of these instruments to think about them from the maker's side rather than only the taker's.

Where I am incomplete is optimisation. Knowing that a book should be updated after flow arrives is
not the same as knowing how much to move it, how to skew quotes toward the side that is more likely
to be right, or how to separate informed takers from uninformed ones in real time. Those are the
questions I would most want to work on, and they are not ones I can answer alone from a residential
connection with a four-figure account.

**What I would do differently.** I built execution before measurement. The analysis in section 7 could
have been run six weeks earlier on data I already had; instead I ran sessions and inferred from an
absence of fills. I would now insist on an expected-value measurement before scaling a strategy rather
than after. I also failed to archive the production forecast, so calibration had to be fitted against
a proxy source — a compromise I would not repeat.

*A note on scope:* when the reactive edge in these markets closed, I went looking for the same
structure elsewhere and built a separate system for World Cup group markets — a cross-market
probability translation rather than a latency strategy. That is documented separately; it shares no
code or thesis with this project beyond the general approach.

---

## Appendix: technical summary

| | |
|---|---|
| Markets | 28 cities, 11 buckets each |
| Data | 3.3 GB tick-level orderbook (50 city-days); 92 days multi-station sensor data; multi-year observation archives |
| Machines | 5, across three providers and a residential line, over a Tailscale mesh |
| Execution | Pre-signed EIP-712 fill-and-kill; fire latency 10,163 ms → 58 ms; ~25 ms RTT to venue |
| Decision layer | Markov decision process over posterior × orderbook state; dual exit horizons; mean-variance utility |
| Reaction model | Exponential repricing `p_pre·e^(−γΔt) + p_post·(1−e^(−γΔt))` |
| State estimation | Kalman filter, ensemble forecast hypotheses, Monte Carlo outcome distributions |
| Scoring | Brier score, log loss, expected calibration error, Bayesian consistency residual |
| Statistics | Variance inflation, partial correlation, leave-one-out cross-validation, out-of-sample EV by entry band |
