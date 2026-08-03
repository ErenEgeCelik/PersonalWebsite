---
title: "The result I published because it made me look worse"
slug: "negative-result"
date: "2026-07-01"
summary: "My market making model was fine. The strategy still could not work, and the reason had nothing to do with the model. Here is why I wrote that down instead of quietly moving on."
tags: ["methodology", "market-making"]
readingTime: "~6 min"
# EXAMPLE COPY — drafted in the design prototype, not written by Eren.
# Rewrite in your own voice, then set draft: false to publish.
draft: true
---

There is a version of this project where I stop at the backtest. The fair value fits, the skew rule is derived rather than tuned, the numbers look good, and I post a chart. Plenty of people stop there.

Instead I formalized the strategy as a Markov Decision Process — states for inventory and time remaining, actions for where to quote, transitions from the fill dynamics I had measured. The point of an MDP here is not to find the optimal policy. It is to find the ceiling: the best you could possibly do if every decision were made perfectly.

The ceiling was low, and it was low for a reason I could not fix. Fills at the top of the book carry the edge. Queue priority there is not accessible to me — not because my model is worse, but because of who is standing in front of me and how fast. At the depth I can actually reach, adverse selection eats the spread.

That is a structural constraint, not a modelling failure, and the distinction matters enormously. A modelling failure is an invitation to iterate. A structural constraint is an instruction to go do something else.

So I documented it. The paper says, in effect: here is a model that works, here is the market it cannot be traded in, and here is the evidence for both claims. If someone hires me on the strength of a backtest I do not believe in, we are both going to find out eventually. I would rather it be now.
