---
name: stop-slop
description: Strip the tells that make prose read as LLM-generated. Use whenever writing or editing prose a human will read as the author's own voice — website copy, project write-ups, README bodies, blog posts, bios, cover letters, commit-adjacent docs. Also use when asked to "make this sound human", "this reads like AI", "de-slop", or to review existing prose for AI tells.
tools: Read, Edit, Write, Grep, Bash
---

# Stop slop

Prose written by a language model has a signature. It is fluent, balanced,
and empty in specific, repeatable ways. This skill names those patterns so
they can be removed.

**This is about the author's credibility.** On a portfolio, a CV, or a
research write-up, prose that reads as machine-written makes the reader
discount the work behind it. A technical reader who spots the rhythm stops
believing the numbers.

## The rule that matters most

**Cut a sentence unless it carries information the reader does not already
have.** Most slop is not wrong, it is redundant — it restates, it frames, it
signals importance. Delete those sentences and the remaining prose sounds
human, because humans writing about their own work are impatient.

Before keeping any sentence, ask: *what fact, number, or decision does this
add?* If the answer is "it sets up the next sentence" or "it emphasises
that the previous point was important" — delete it.

## The tells

### 1. The antithesis reflex
> "It is not a modelling result, it is a structural one."
> "Not because my model is worse, but because of who is standing in front of me."
> "The MDP is there to find the ceiling, not the policy."

The `not X, but Y` / `X is not A, it is B` frame is the single loudest tell.
Once per document is a choice. Three times is a signature. **Fix:** state Y
and drop X, unless the reader would genuinely have assumed X.

### 2. Triads
> "data collection, modelling, execution, risk, and post-mortem analysis"
> "the resolution mechanics, the feeds, and how quotes behave"

Real writers list two things, or five uneven ones. Three balanced items in a
row is the model reaching for rhythm. **Fix:** cut to the two that matter, or
make the list uneven and specific.

### 3. The aphoristic closer
> "…which in physics and in markets is all you ever get."
> "The pair is what removes the tail."
> "The process is the product."

A short, quotable sentence closing a paragraph. It feels like insight and
carries nothing. **Fix:** delete it. The paragraph ends on its last fact.

### 4. Meta-commentary
> "This is the part I would want to discuss in an interview."
> "The methodology is the part I would defend hardest."
> "Two things are worth saying about that."

Writing about the writing. **Fix:** delete and let the content rank itself.

### 5. Em-dash addiction
More than one em dash per paragraph, or dashes doing the work of full stops.
**Fix:** most become commas, colons, or new sentences. Budget: roughly one
per three paragraphs.

### 6. Superlative framing
> "The single most useful thing I ran…"
> "the standout result"
> "genuinely original"

**Fix:** state what it did. If it was the most useful, the reader will work
that out.

### 7. Filler intensifiers
`genuinely`, `actually`, `precisely`, `simply`, `truly`, `deeply`,
`fundamentally`, `essentially`, `notably`, `importantly`, `it is worth
noting`. Almost always deletable with no loss.

### 8. Corporate-LLM vocabulary
`delve`, `leverage` (as a verb), `robust`, `seamless`, `landscape`, `realm`,
`testament to`, `underscore`, `pivotal`, `crucial`, `meticulous`, `nuanced`,
`showcase`, `boasts`, `elevate`, `unlock`, `harness`, `navigate` (figurative),
`tapestry`, `intricate`, `multifaceted`, `holistic`, `cutting-edge`,
`state-of-the-art`, `game-changing`, `at the intersection of`.

### 9. Balanced-clause rhythm
Sentences that swing evenly around a comma or dash, paragraph after
paragraph. **Fix:** vary length hard. Follow a 30-word sentence with a
four-word one. Let some paragraphs be one sentence.

### 10. Trailing participial summary
> "…, which is what made the measurements possible at all."
> "…, quantifying the gap between simulation and live."

A clause that summarises the sentence it is attached to. **Fix:** cut, or
promote to its own sentence with a real subject.

### 11. Hollow abstractions
`discipline`, `rigor`, `honesty`, `philosophy`, `approach`, `methodology`
used as the subject of a sentence. **Fix:** replace with what was done.
"The discipline that produced this" → "I ran the placebo before the backtest."

## What to keep

Do not sand prose into flatness. Keep:

- **Numbers, dates, names, versions.** Specificity is the opposite of slop.
- **Admissions.** "I stopped it there rather than running until it said
  something flattering" is worth more than any framing sentence.
- **Odd, concrete detail.** The Munich mis-fire, the 5,031 ms outlier, the
  $80 loss. These cannot be generated; they are evidence of having been there.
- **A real voice**, including opinions and irritation. Humans writing about
  their own work are not neutral.

## Procedure

1. **Read the whole piece first.** Slop is a distribution, not a word list —
   a single `not X but Y` is fine, five is the problem.
2. **Run the mechanical check** (below) to get counts.
3. **Cut before rewriting.** Most fixes are deletions. Aim to remove 15–30%
   of the words without losing a single fact.
4. **Re-read the opening and closing paragraph of each section.** Slop
   concentrates there — that is where the model frames and summarises.
5. **Check the result against the source facts.** Deletion must not take a
   caveat, qualifier, or number with it. Never delete a hedge that is doing
   honest work ("paper-traded", "self-reported", "inconclusive").

## Mechanical check

```bash
# counts per file; run from the repo root
for f in "$@"; do
  echo "=== $f"
  printf '  em-dash        %s\n' "$(grep -o '—' "$f" | wc -l)"
  printf '  not-X-but-Y    %s\n' "$(grep -oiE '(is not|are not|was not|were not|not because)[^.]{0,60}(, it is|, but|but rather)' "$f" | wc -l)"
  printf '  intensifiers   %s\n' "$(grep -oiwE 'genuinely|actually|precisely|simply|truly|deeply|fundamentally|essentially|notably|importantly' "$f" | wc -l)"
  printf '  llm-vocab      %s\n' "$(grep -oiwE 'delve|leverage|robust|seamless|landscape|realm|underscore|pivotal|crucial|meticulous|nuanced|showcase|boasts|elevate|unlock|harness|intricate|multifaceted|holistic' "$f" | wc -l)"
  printf '  meta-comment   %s\n' "$(grep -ociE 'worth (noting|saying)|it is important to|this is the part|i would (defend|argue)' "$f")"
  printf '  words          %s\n' "$(wc -w < "$f")"
done
```

Rough targets for a 1,000-word piece: em-dash under 8, `not X but Y` under 2,
intensifiers under 3, LLM vocabulary 0, meta-commentary 0.

The counts are a smoke alarm, not a grade. A piece can pass every count and
still read as generated if every paragraph is the same shape.

## Before and after

**Before** (73 words, four tells):
> The single most useful thing I ran was designed to embarrass the rest.
> Tape simulation credited +123.5 c/slot on exactly the weekend the live arm
> lost $31 — quantifying the sim-to-live gap. The conclusion I wrote down was
> that positive backtests carry zero go-live weight in violent regimes. That
> is not a modelling failure, it is a structural constraint, and the
> distinction matters enormously.

**After** (44 words):
> Tape simulation credited +123.5 c/slot on the weekend the live arm lost $31.
> I ran the comparison expecting the backtest to hold up. It did not. In
> violent regimes the overstatement reached ~850 c/slot, so I stopped treating
> positive backtests as evidence for anything.

The numbers survive. The framing does not. The admission ("I ran it expecting
the backtest to hold up") does work that "the single most useful thing" only
gestured at.
