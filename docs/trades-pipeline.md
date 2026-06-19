# Trades pipeline

How the live trade data on https://erenege.com/trades flows from the
bot into the website.

## Architecture

```
┌─ crypto-bot (VPS / GitHub Actions) ────────┐
│  daily:                                     │
│    1. read internal trade log (last 24h)    │
│    2. compute summary (PnL, win-rate, etc.) │
│    3. strip proprietary fields              │
│    4. write trades.json (schema below)      │
│    5. commit + push to personal-website     │
└──────────────────┬──────────────────────────┘
                   │ git push
                   ▼
┌─ personal-website (this repo) ──────────────┐
│  public/data/trades.json                    │
│       │ imported at build time              │
│       ▼                                     │
│  /trades page · home page Live PnL widget   │
└─────────────────────────────────────────────┘
                   │ Vercel auto-deploys
                   ▼
              erenege.com
```

## Schema — `public/data/trades.json`

The website's `src/lib/trades.ts` defines the TypeScript types this
file must satisfy. Producer MUST emit a file matching:

```jsonc
{
  "updatedAt": "ISO-8601 timestamp",       // when this snapshot was produced
  "source": "live | shadow | backfill",    // free-form label
  "note": "optional human-readable note",  // shown on /trades, omit when empty
  "summary": {
    "status":             "shadow | live | paused",
    "paperPnl24h":        124.83,
    "paperPnlAllTime":    1542.30,
    "tradesCount24h":     47,
    "tradesCountAllTime": 1893,
    "winRate":            0.523
  },
  "recent": [
    {
      "ts":     "2026-06-19T12:08:42Z",   // ISO-8601 UTC
      "side":   "buy | sell",
      "ticker": "BTC-UP | BTC-DN | ETH-UP | ETH-DN | ...",
      "quote":  0.61,    // bot's quote at decision time
      "entry":  0.48,    // fill / mark at entry
      "exit":   0.52,    // resolution price / settlement
      "pnl":    8.40     // realized in USDC
    }
    // ...keep this list small (last ~50 trades is plenty for the UI)
  ]
}
```

### Field conventions

- All prices are in **probability units** (0–1).
- All PnL figures are in **USDC**.
- Timestamps are **UTC ISO-8601** with a `Z` suffix.
- Do not include wallet addresses, model parameters, signal scores,
  or anything else you'd not want public.
- `recent` can be empty in `shadow` mode — the UI handles it.

## Producer options

Pick the one that fits the bot's deployment:

### Option A — Bot runs a daily script that pushes to the website repo

Best when the bot already has rich local data (logs, sqlite, etc.).

```bash
# on the VPS, in crypto-bot/
0 6 * * *  /home/ubuntu/crypto-bot/scripts/export_trades.sh
```

Script flow:
1. Query bot's data store for last 24h
2. Build the JSON above
3. `git clone --depth 1 git@github.com:ErenEgeCelik/PersonalWebsite.git /tmp/ws`
4. Write to `/tmp/ws/public/data/trades.json`
5. `git -C /tmp/ws add public/data/trades.json`
6. `git -C /tmp/ws commit -m "chore(trades): daily update YYYY-MM-DD"`
7. `git -C /tmp/ws push`

Needs: SSH deploy key on the website repo, or a fine-grained PAT.

### Option B — GitHub Action in crypto-bot writes to website

If the bot's data is reachable from GitHub Actions (e.g. via an API
the bot exposes), schedule an Action that builds the JSON and pushes
to the website repo. Same end result, no VPS cron needed.

### Option C — GitHub Action in personal-website pulls from Polymarket

If you have a real wallet on Polymarket, an Action in *this* repo
can poll Polymarket's public API for that wallet's trades and write
the JSON itself. Bot stays untouched.

Limitation: only surfaces real (settled) trades, not paper-PnL from
shadow mode.

## Failure modes

- **Stale data.** The page just shows whatever's in `trades.json`. If
  the producer dies, `updatedAt` keeps showing the last successful
  snapshot — add monitoring on the producer side.
- **Schema drift.** The website type-checks JSON shape at build time
  via `as TradesData`. A bad commit fails the Vercel build (good — the
  old data stays live).
- **Vercel build cost.** A push per day → one build per day → trivial.
  Don't increase frequency to per-minute without considering Vercel's
  free-tier build minutes.
