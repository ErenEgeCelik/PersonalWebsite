#!/usr/bin/env bash
# Count AI-prose tells per file. Rates are per 1,000 words.
#   .claude/skills/stop-slop/check.sh content/**/*.md
# Targets: em-dash < 8/1k, antithesis < 2, intensifiers < 3, vocab 0, meta 0.
# The counts are a smoke alarm, not a grade — a file can pass every one and
# still read as generated if every paragraph has the same shape.

set -u

printf '%-34s %6s  %-14s %7s %7s %6s %5s\n' FILE WORDS EM-DASH ANTITH INTENS VOCAB META
printf '%.0s-' {1..92}; echo

for f in "$@"; do
  [ -f "$f" ] || continue
  w=$(wc -w < "$f")
  [ "$w" -eq 0 ] && continue
  em=$(grep -o '—' "$f" | wc -l)
  ant=$(grep -oiE '(is not|are not|was not|were not|not because)[^.]{0,70}(, it is|, but|but rather)' "$f" | wc -l)
  int=$(grep -oiwE 'genuinely|actually|precisely|simply|truly|deeply|fundamentally|essentially|notably|importantly' "$f" | wc -l)
  voc=$(grep -oiwE 'delve|leverage|robust|seamless|landscape|realm|underscore|pivotal|crucial|meticulous|nuanced|showcase|boasts|elevate|unlock|harness|intricate|multifaceted|holistic|tapestry' "$f" | wc -l)
  meta=$(grep -ciE 'worth (noting|saying)|it is important to|this is the part|i would (defend|argue)|the single most' "$f")
  awk -v f="$f" -v w="$w" -v e="$em" -v a="$ant" -v i="$int" -v v="$voc" -v m="$meta" 'BEGIN{
    rate = e*1000/w
    flag = (rate >= 8 || a >= 2 || i >= 3 || v > 0 || m > 0) ? "  <-- over" : ""
    printf "%-34s %6d  %3d (%4.1f/1k) %7d %7d %6d %5d%s\n", f, w, e, rate, a, i, v, m, flag
  }'
done
