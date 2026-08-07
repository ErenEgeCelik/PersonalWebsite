---
title: "Market efficiency in Polymarket's 5-minute BTC markets"
slug: "crypto-mm"
order: 3
kicker: "Research · Polymarket"
year: "2026"
period: "June – July 2026"
role: "Independent researcher"
stack: "Python, numpy, asyncio, multi-venue WebSockets, AWS"
venue: "Polymarket — BTC/ETH 5-minute binary contracts, resolved on the Chainlink oracle"
short: "Rejected my own maker strategy on fresh out-of-sample data at −0.98c per quote moment, then measured why the backtest had disagreed: it credited +$21 in the exact six slots where the live arm lost $31."
summary: "A market-microstructure study of Polymarket's most competitive market. I replicated the incumbent maker's quote schedule to a median within-slot R² of 0.92, derived a fair value and an inventory-skew rule from first principles, then rejected every candidate edge under placebo, chronological out-of-sample and cost-inclusive tests. The market is efficient at the retail-accessible level and the binding constraint is queue position rather than model quality. The most useful output was a per-slot measurement of how far the replay diverges from live."
tags: ["Microstructure", "Falsification testing", "Market making", "MDP"]
paper: "/writing/polymarket-5min-microstructure"
---

## The question

Polymarket lists a binary contract every five minutes on whether BTC finishes above where it started. It resolves against the Chainlink oracle, so there is no judgment anywhere in the process. One participant quotes nearly all of these contracts.

I wanted to answer one question: is there edge here that a retail participant can actually reach?

The design rule I set at the start was that a positive backtest proves nothing. It can only fail to rule something out. Everything downstream follows from taking that seriously.

## Reverse-engineering the incumbent

If one maker prices every contract, its quotes are a function of something.

I logged its quotes alongside every candidate input: Binance, Coinbase, Kraken, Bitstamp, and the Chainlink oracle relay. Then I ran exclusive falsification tests. Propose a feed composition, then search the tape for a window where that composition has to produce a quote the maker did not post. Compositions that survive every attempt to kill them are what is left.

The surviving composition replicates its quotes at a median within-slot R² of 0.92, about six ticks of RMSE out of sample.

It is also better calibrated than anything I built. Over 404 slots, scored against realised outcomes, the incumbent's mid returned a Brier of 0.2011 against my best fair value's 0.2089. The gap is stable rather than noise, and it repeats on ETH. Replicating a quote schedule is structural understanding, not alpha. I made "the incumbent is good at fair value" an explicit axiom of everything I built afterwards, rather than leaving it as an assumption I had not noticed making.

## Deriving the quote

For a binary contract on whether a Brownian price finishes above a strike, fair value is a probit in the scaled distance to the strike:

$$
\text{fair} = \Phi\!\left(\frac{F + \text{offset} - \text{anchor}}{\sigma\sqrt{\tau}}\right)
$$

The offset carries Chainlink lag compensation, and volatility comes from trailing 15-minute realised vol.

The inventory skew is Avellaneda–Stoikov adapted to binary payoffs in logit space, where the optimal quote shift has a closed form in risk aversion, inventory and payoff variance. That form explains the asymmetric quoting visible in the book. An ad-hoc skew parameter does not.

## Where the edge actually lives

The result that reframed the project came from the fill model.

I fitted a hazard form,

$$
A = 1 - \exp\!\left(-\,k\,\lambda\,T / r_0\right)
$$

and a matched placebo killed the pure-flow version, where fills depend on trailing order flow alone. What survived puts the information in $r_0$: the queue depth ahead of you.

So the constraint is structural. The incumbent supplies enough liquidity for the flow that arrives, and my orders were never far enough forward in the queue to collect the spread. Moving to the 15-minute and 1-hour markets trades a queue problem for a flow problem. Better models do not move any of this.

## Verification

The methodology is hostile to its own conclusions by construction:

- **Slot-cluster bootstrap.** Clustering at the slot level, not the fill level. Fills inside one slot are heavily dependent.
- **Matched-frequency placebos.** A fake signal firing at the same rate as the real one. If the placebo earns too, the signal earned nothing.
- **Chronological 70/30 splits.** Random splits leak across a time series.
- **Pre-declared definitions.** The methods document was written before any results existed.
- **Adverse selection α swept, not chosen.** I cannot measure α from my own data. Rather than pick a flattering value, it is carried as a free parameter with a breakeven α\* and confidence intervals, so a reader can see how much of the conclusion depends on it.

The strategy is a regime-conditional MDP over (regime, queue, inventory, time), quoting a side only when its conditional expected value is positive. I used the MDP to find the ceiling: the best available if every decision were made perfectly.

## The verdict

Fresh out-of-sample data rejected the static maker front: **−0.9845 cents per eligible quote moment**, 90% slot-clustered confidence interval **[−1.626, −0.364]**, over 312 eligible moments across 193 slots. The interval excludes zero.

An earlier run of that same measurement came out positive, and the difference was my own modelling error. Virtual fills were counted from the decision instant, but an order does not activate until about 50 ms later, so the first 50 ms of prints are uncatchable by construction. Correcting the activation lag removed roughly two thirds of the apparent edge and dropped the breakeven adverse-selection cost to 0.34 c, below the lower bound of every proxy I had for it.

Why the fresh block is worse than the older one is structural rather than statistical. The improve seat closes about 35% faster than it did a month earlier, and post-fill drift against the position runs 2.7× higher. Competition got quicker and the informed flow got harder to see — on a feed that had, by every measure I applied to it, gone quieter.

## The test that broke the rest

Over one weekend the tape replay credited **+123.5 c/slot** [103, 144] across 368 slots, positive on all eight tapes. In the exact six slots where the live paper arm lost **$31**, the replay credited **+$21**.

I ran that comparison expecting the backtest to survive it. The simulator's best windows turned out to be the live arm's worst. The overstatement runs 60–130 c/slot in ordinary conditions and reaches roughly 850 c/slot in violent ones, which is where I stopped treating positive backtests as evidence of anything.

The live A/B that would have settled the engine question came back inconclusive: 157 matched slots on a VPS running the base engine against the EV model, Δ +22.7 c/slot, ci90 [−16.7, +61.4]. I stopped it there instead of running until it said something I liked.

Real money never went past a five-trade taker test at $2 a trade, which finished around breakeven. This project never traded at scale and its result is not a P&L.

## Superseded results

An earlier paper campaign reported +$1.07 per slot over 555 slots, and a shadow implementation cut measured adverse fills from 65% to 34%. Neither is evidence for the current system. The campaign priced decisions off the taker-path latency ledger, roughly 330 ms, for a decision a maker makes in 24–50 ms; the adverse-fill figure came from 3,661 simulated fills that assumed instant execution. Both were the headline result for a while, so removing them without saying what replaced them seemed worse than leaving them here.

## What I take from it

The answer is negative and I can name the mechanism: queue priority against a liquidity-rich incumbent. That is worth more to me than a backtest I would have had to defend later.

Working through the whole thing left me able to think about these contracts from the maker's side. The resolution mechanics, the relative latency of each feed, how quotes behave around a forced repricing, where informed flow shows up.

The gap is optimisation. Knowing a book should move after flow arrives is different from knowing how far to move it, how to skew toward the side more likely to be right, or how to tell informed takers from uninformed ones while it is happening. Those are the problems I want to work on, and I cannot get at them alone from a residential connection with a four-figure account.
