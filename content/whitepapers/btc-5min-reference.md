---
title: "BTC 5-minute markets — a plain-language reference"
subtitle: "Pricing, market-making, and what the tests said"
slug: "btc-5min-reference"
date: "2026-06-20"
status: "Reference note"
tags: ["markets", "polymarket", "market-making"]
summary: "The Brownian fair-value model, the market-making skew algorithm and what every test returned, written in plain language. A companion to the full microstructure study rather than a replacement for it."
---

A short reference for the BTC 5-minute up/down market: the fair-value model, the market-making skew, and what each test returned. The full empirical study is in the [microstructure whitepaper](/writing/polymarket-5min-microstructure).

## The market in one paragraph

Every five minutes Polymarket opens a BTC up-or-down market. You buy UP or DOWN shares, each paying $1 if right and $0 if wrong. It resolves on Chainlink's BTC price: UP wins if the Chainlink price at the end of the slot is higher than at the start. That start price is the anchor, the price to beat. Resolution does not read the spot exchanges directly. Chainlink does, blending Coinbase, Bitstamp and Kraken.

## 1. Brownian fair value

Over five minutes BTC moves roughly like a random walk, so the chance it ends up is a question of how far above or below the anchor you are, measured in volatility units.

```
fair_P(UP) = Φ( (price_now − anchor) / (σ · √(time_left)) )
```

- `Φ` is the normal CDF.
- `price_now` comes from a fast feed, the mean of Coinbase and Binance spot.
- `anchor` is the Chainlink price at the slot boundary.
- `σ` is dynamic, roughly `3.41 + 0.40 × realized-15min-vol`. It moves day to day. A fixed σ breaks the model.

The fit is good. It reproduces the market's mid at R² ≈ 0.92, and fair_P is unbiased against realised outcomes. Live σ runs around 2.7.

The catch is that the market is well priced too, so my fair value lands very close to the market's. "Buy when fair > ask" looks strong in a backtest and dies out of sample to the winner's curse. Prediction alone produces no edge here.

## 2. Inventory skew

Quoting both sides accumulates inventory. The skew nudges quotes back toward flat.

```
reservation center:  logit(r) = logit(p) − γ·q          (q = net position, γ = risk aversion)
half-spread (logit):  dx = (1/γ)·ln(1 + γ/K) + state-term
quotes:               bid = sigmoid(x_r − dx),  ask = sigmoid(x_r + dx)
```

When q > 0 the centre shifts down, the bid drops, the ask gets more aggressive, and inventory sheds. The `p(1−p)` state dependence — wider near 0.50, tighter near 0 and 1 — falls out of the logit algebra rather than being added by hand.

The backbone is GLFT (Guéant–Lehalle–Fernández-Tapia) with Dalen's logit-space binary adaptation. Dalen's version carries an extra `σ²·(T−t)` term that is wrong for binaries, where time enters through `p → 0/1` instead. Correcting that was the change that un-froze an imbalanced inventory in the live engine and pulled the net position back toward zero.

## 3. What the tests said

| Test | Result |
|---|---|
| Fair-value calibration | Works. Unbiased, R² ≈ 0.92 |
| Directional edge, 7 assets | None out of sample. The market is efficient |
| Maker spread capture | Roughly breakeven. The spread does not cover adverse selection |
| Cancel speed | ~38 ms median, 218 ms p99, faster than the incumbent. Only helps defensively; a 250 ms server delay rules out taking |
| Dodge, cancelling before a crash | Works, about +0.6c, avoids being picked off |
| Spike reversion, intra-slot | Dead. It was an anchor-lag artifact |
| Spot mean reversion after a large move | Real on spot, +2.7c on BTC after costs, but the market probably prices it, and it shrinks with horizon |
| Two small live maker sessions | Fills benign, the fixes held, skew solved the freeze. P&L roughly breakeven on a tiny sample |

## 4. Data behind it

- About two days of BTC spot, full book and trade tape.
- A multi-asset 5-minute panel: 7 assets, ~107 slots each.
- A 15-minute BTC/ETH panel, ~148 slots.
- 180 days of BTC and ETH 1-minute klines for the spot tests.

## Bottom line

The pricing works and the engine makes markets safely. What is missing is anything capturable: the market is efficient, the spread is around breakeven, and the latency advantage only defends.

The question I would take up next is whether the incumbent maker lags the spot mean reversion or has already priced it in.
