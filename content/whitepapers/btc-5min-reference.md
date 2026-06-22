---
title: "BTC 5-minute markets — a plain-language reference"
subtitle: "Pricing, market-making, and what the tests said"
slug: "btc-5min-reference"
date: "2026-06-20"
status: "Reference note"
tags: ["markets", "polymarket", "market-making"]
summary: "A working reference for the Polymarket BTC 5-min binary market — the Brownian fair-value model, the market-making skew algorithm, what the tests said, and what tools/data we have. Plain-language companion to the [main microstructure whitepaper](/whitepapers/polymarket-5min-microstructure)."
---

Plain-language reference for the BTC 5-minute up/down market: the fair-value model, the market-making skew, what the tests said, and what data/tools we have. For the full empirical study, see the [microstructure whitepaper](/whitepapers/polymarket-5min-microstructure).

## The market in one paragraph

Every 5 minutes Polymarket opens a BTC "up or down" market. You buy UP or DOWN shares (each pays $1 if right, $0 if wrong). It resolves on **Chainlink's** BTC price: UP wins if the Chainlink price at the slot's *end* is higher than at its *start* (the "anchor" / price-to-beat). Not the spot exchanges directly — Chainlink (which itself blends Coinbase/Bitstamp/Kraken).

## 1. Brownian fair-value model

**Idea:** over 5 minutes BTC moves roughly like a random walk, so the chance it ends UP is just "how far are we above/below the start, measured in volatility units."

```
fair_P(UP) = Φ( (price_now − anchor) / (σ · √(time_left)) )
```

- `Φ` = normal CDF (probit).
- `price_now` = our fast feed = **mean(Coinbase, Binance)** spot.
- `anchor` = Chainlink price at the exact slot boundary (the price-to-beat).
- `σ` = volatility, **dynamic**: ≈ `3.41 + 0.40 × realized-15min-vol`. Changes daily — a fixed σ breaks it.

**How good is it?** Very good: reproduces the market's mid with **R² ≈ 0.92**, fair_P is **unbiased** (well-calibrated), σ live ≈ 2.7.

**The catch:** the market is *also* well-priced, so our fair ≈ the market's price. "Buy when fair > ask" looks great in backtest but **dies out-of-sample** (winner's curse) → no edge from prediction alone. The market is efficient.

## 2. Skew algorithm (market-making)

**Problem:** quoting both sides builds up inventory (too long/short); you want to nudge quotes back to flat.

**The math (derived for binary markets):**

```
reservation center:  logit(r) = logit(p) − γ·q          (q = net position, γ = risk-aversion)
half-spread (logit):  dx = (1/γ)·ln(1 + γ/K) + state-term
quotes:               bid = sigmoid(x_r − dx),  ask = sigmoid(x_r + dx)
```

- Long (q > 0) → center shifts down → bid lower / ask more aggressive → sheds inventory.
- The `p(1−p)` state-dependence (wider near 0.50, tighter near 0/1) comes free from the logit math.
- Framework: **GLFT** (Guéant–Lehalle–Fernández-Tapia) backbone + **Dalen** logit-space binary adaptation. We corrected Dalen — it carried an extra `σ²·(T−t)` term that's wrong for binaries; time enters via `p → 0/1` instead.
- Deployed parameters: `γ = 0.04`, `BETA = 0.04`, `K = 10`. This is **FIX 2** of the live maker — confirmed it un-froze an imbalanced inventory (pulled net back to ~0).

## 3. What the tests said

| Test | Result |
|---|---|
| Fair-value calibration | **Works** — unbiased, R² ≈ 0.92 |
| Directional edge (predict up/down) | **None** out-of-sample (efficient), 7 assets |
| Maker spread-capture | **~Breakeven** — spread doesn't cover adverse selection |
| Our speed | Fast (cancel ~38 ms median / 218 ms p99), faster than the incumbent MM — but speed only helps **defense** (dodge); can't capture as taker (250 ms server delay) |
| Dodge (cancel before a crash) | **Works** — +~0.6c realistic, avoids being picked off |
| Spike-reversion (intra-slot) | **Dead** — was an anchor-lag artifact |
| Underlying REV_spk (spot mean-reversion after a big move) | **Real on spot** (+2.7c BTC after costs) — but the market likely prices it; shrinks with horizon |
| Live maker tests (2 small, real money) | Fills benign, the three fixes worked, skew solved the freeze; PnL ~breakeven (tiny n) |

## 4. Data and tools

**Data on hand:**
- ~2 days of BTC (spot + full book + trade tape).
- Multi-asset 5-min panel: 7 assets, ~107 slots each.
- 15-min BTC/ETH panel: ~148 slots, growing.
- 180-day BTC+ETH 1-min klines for underlying-spot tests.

**Engine:**
- `mm_maker.py` — the live maker engine (Brownian + skew + dodge + safety).
- Multi-asset efficiency battery.
- Fair-value calibration tools.
- Recorders + supervisors (15-min, multi-asset).

**Infra:** VPS Ireland (recorders), CLOB client (post-only maker), two wallets (one shared with a sibling bot — ID-scoped cancel only).

## Bottom line

We can **price** BTC 5m accurately (the Brownian model is good) and **make markets safely** (the engine works). What we *don't* have is a **capturable edge** on 5m: the market is efficient, the spread is ~breakeven, and latency only defends.

The open question (Track A): does the maker **lag** the REV_spk reversion, or has it already priced it?
