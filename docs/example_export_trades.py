"""Skeleton — adapt to crypto-bot's actual data store.

Reads the bot's last-24h trade log, builds the website's trades.json,
commits and pushes it to the personal-website repo.

Run from a cron on the VPS:

    0 6 * * *  cd /home/ubuntu/crypto-bot && \
               venv/bin/python -m scripts.export_trades >> logs/export.log 2>&1

Env vars required:
    WEBSITE_REPO_PATH   absolute path to a local clone of personal-website
    GIT_USER_NAME       commit author name
    GIT_USER_EMAIL      commit author email
"""

from __future__ import annotations

import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path

# ────────────────────────────────────────────────────────────
# 1. Pull from the bot's data store.
# Replace this block with whatever the bot actually uses
# (sqlite, parquet, jsonl logs, in-memory state, etc.).
# ────────────────────────────────────────────────────────────

def load_recent_trades(hours: int = 24) -> list[dict]:
    """Return the last `hours` trades from the bot's log."""
    # TODO: implement against the bot's actual store
    raise NotImplementedError


def compute_summary(trades_24h: list[dict], all_trades: list[dict]) -> dict:
    pnl_24h = sum(t["pnl"] for t in trades_24h)
    pnl_all = sum(t["pnl"] for t in all_trades)
    wins = sum(1 for t in all_trades if t["pnl"] > 0)
    return {
        "status": "shadow",  # set "live" once trading real money
        "paperPnl24h": round(pnl_24h, 2),
        "paperPnlAllTime": round(pnl_all, 2),
        "tradesCount24h": len(trades_24h),
        "tradesCountAllTime": len(all_trades),
        "winRate": round(wins / len(all_trades), 3) if all_trades else 0.0,
    }


def to_public_row(t: dict) -> dict:
    """Strip proprietary fields; keep only what the website schema needs."""
    return {
        "ts": t["ts"],          # ISO-8601 UTC, e.g. "2026-06-19T12:08:42Z"
        "side": t["side"],      # "buy" | "sell"
        "ticker": t["ticker"],  # "BTC-UP" etc.
        "quote": round(float(t["quote"]), 2),
        "entry": round(float(t["entry"]), 2),
        "exit":  round(float(t["exit"]),  2),
        "pnl":   round(float(t["pnl"]),   2),
    }


# ────────────────────────────────────────────────────────────
# 2. Build the JSON the website expects.
# ────────────────────────────────────────────────────────────

def build_payload() -> dict:
    trades_24h = load_recent_trades(hours=24)
    all_trades = load_recent_trades(hours=24 * 365)  # or full history
    return {
        "updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "source": "live",
        "summary": compute_summary(trades_24h, all_trades),
        "recent": [to_public_row(t) for t in trades_24h[:50]],
    }


# ────────────────────────────────────────────────────────────
# 3. Write + commit + push.
# ────────────────────────────────────────────────────────────

def main() -> None:
    repo = Path(os.environ["WEBSITE_REPO_PATH"]).resolve()
    target = repo / "public" / "data" / "trades.json"
    target.parent.mkdir(parents=True, exist_ok=True)

    payload = build_payload()
    target.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    # Pull first to avoid push conflicts (the website may have been edited).
    subprocess.run(["git", "-C", str(repo), "pull", "--rebase"], check=True)

    # Only commit if the file actually changed.
    diff = subprocess.run(
        ["git", "-C", str(repo), "diff", "--quiet", str(target)],
    )
    if diff.returncode == 0:
        print("no change in trades.json — skipping commit")
        return

    env = os.environ.copy()
    env["GIT_AUTHOR_NAME"] = env["GIT_COMMITTER_NAME"] = env["GIT_USER_NAME"]
    env["GIT_AUTHOR_EMAIL"] = env["GIT_COMMITTER_EMAIL"] = env["GIT_USER_EMAIL"]

    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    subprocess.run(["git", "-C", str(repo), "add", str(target)], check=True, env=env)
    subprocess.run(
        ["git", "-C", str(repo), "commit", "-m", f"chore(trades): daily update {today}"],
        check=True, env=env,
    )
    subprocess.run(["git", "-C", str(repo), "push"], check=True, env=env)
    print("pushed trades.json")


if __name__ == "__main__":
    main()
