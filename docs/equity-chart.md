# The equity chart on the home page

The chart is driven entirely by `content/equity.json`. It **does not
render** until that file has at least three real points — it will never
draw an invented curve.

## The file

```json
{
  "label": "Polymarket account value",
  "note": "single $30 deposit, no additional capital",
  "currency": "USD",
  "points": [
    { "date": "2026-03-04", "value": 30 },
    { "date": "2026-03-18", "value": 71 },
    { "date": "2026-04-01", "value": 154 },
    { "date": "2026-06-02", "value": 1204 }
  ]
}
```

- `date` — `YYYY-MM-DD`. Order doesn't matter; they get sorted.
- `value` — total account value in USD on that date, not daily P&L.
- Weekly or bi-weekly checkpoints are plenty. The line is smoothed
  (Catmull-Rom) between points, so it reads as a curve without
  inventing peaks that aren't in the data.
- `note` prints under the chart on the right. `label` is only used for
  the screen-reader description.

The big `$30 → $1,200` readout under the chart comes from the first and
last points automatically — don't hardcode it anywhere.

## Where to get the numbers

Three options, in order of effort:

**1. From memory / your own records.** Account value on a handful of
dates is real data. Eight to twelve checkpoints across the three months
is enough for a good-looking curve. This is the fastest path and it is
not an approximation of anything — those were the actual balances.

**2. From the Polymarket UI.** Your profile page shows a portfolio
value chart. Read the values off it at regular intervals and type them
in.

**3. From the Polymarket data API.** With the proxy wallet address:

```
https://data-api.polymarket.com/value?user=<address>
https://data-api.polymarket.com/activity?user=<address>&limit=500
```

`activity` returns fills with timestamps and sizes; accumulating those
gives a full curve. Give me the address and I'll pull it and write the
file.

## Note on what's in the bot repo

`D:\crypto-bot\logs\` holds `mm_maker_*.jsonl` from the **paper /
shadow** market-making runs, not the live account. Those logs are the
right source for a *shadow P&L* chart if you ever want one, but they
are not the $30 → $1,200 story and shouldn't be labelled as it.
