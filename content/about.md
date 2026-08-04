---
# Portrait: drop a file in public/ and put its path here.
# Leave empty to hide the portrait slot.
portrait: "/eren.jpg"
portraitAlt: "Eren Ege Çelik"
---

I study physics at METU. For the past year most of my time has gone into
prediction markets: the probability models, the infrastructure that feeds
them, and the execution layer that acts on them.

I work in a fixed order. First I write down how I think the market works, in
words, before any code. Then the Markov decision process that falls out of
that description. Then I fill the chains with probability calculations from
data I trust. An MDP is to me what a free-body diagram is in mechanics.

Two habits do most of the work. The first is deriving before fitting: when I
needed a fair value for a binary contract on a Brownian price, the probit
form is what the assumption produces, not something I looked up. Every
parameter you fit instead of derive is somewhere a bad assumption can hide.
The second is looking for the window where my own model has to be wrong,
and running that test before the one that would confirm it.

There is no machine learning in any of this. The statistics are hand-rolled
on numpy. A Kalman filter I can debug is worth more to me than a library I
cannot.

The results that made me look worse are on this site too. I retired a
weather strategy after a scan of 32 elimination events put every entry band
at negative expected value. A market-making study I spent two months on
concluded that the market is efficient at the level I can reach. A football
model bought contracts on teams that were not playing, and I had been
ranking opportunities in a way that made that inevitable.

What I am missing is scale, and people who have been doing this longer to
argue with.
