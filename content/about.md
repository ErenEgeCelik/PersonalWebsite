---
# Portrait: drop a file in public/ and put its path here.
# Shoot on a dark or black background — it's blended into the page with
# mix-blend-mode: lighten, so dark backgrounds fall away entirely.
# Leave empty to hide the portrait slot.
portrait: ""
portraitAlt: "Eren Ege Çelik"
---

I am a physics undergraduate at METU. For the last year most of my attention
has gone into prediction markets — building the probability models, the data
infrastructure and the execution around them, then measuring whether any of
it actually works.

My working method is the same one physics gave me, and I use it deliberately.
First the philosophy: a qualitative account of how the market actually works,
written down before any code. Then the Markov decision process that falls out
of it — the skeleton, the states, the actions. Then the chains get filled with
probability calculations built from data I trust. An MDP is to me what a
free-body diagram is in mechanics: not the answer, but the thing that makes
the answer possible to write down at all.

The second habit is deriving before fitting. When I needed a fair value for a
binary contract on a Brownian price, the probit form was not something I
looked up — it is what the assumption produces. Every parameter you fit
instead of derive is a place a bad assumption can hide. The third is
falsification: propose a model, then hunt for the window where it must be
wrong. What survives is not proven, it is merely not yet dead, which in
physics and in markets is all you ever get.

None of it is machine learning. The statistics are hand-rolled on numpy,
on purpose — a Kalman filter I can debug beats a library I cannot.

The work here includes the results that made me look worse, because those are
the ones worth reading. A weather strategy retired because an out-of-sample
scan said every entry band was negative. A market-making study whose honest
answer is that the market is efficient at the level I can reach, and whose
binding constraint turned out to be queue position rather than model quality.
A football model that was confidently wrong in a way that looked exactly like
an edge, until I asked which event was supposed to close the gap.

What I lack is scale and the benefit of working alongside people who have
done this longer — which is precisely what I am looking for.
