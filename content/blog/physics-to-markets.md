---
title: "Physics gave me the priors; markets gave me the feedback loop"
slug: "physics-to-markets"
date: "2026-05-01"
summary: "On why a physics undergraduate ended up deriving option-like pricing rules for five-minute crypto contracts, and what actually transferred."
tags: ["methodology", "physics"]
readingTime: "~5 min"
# EXAMPLE COPY — drafted in the design prototype, not written by Eren.
# Rewrite in your own voice, then set draft: false to publish.
draft: true
---

The honest answer to "why markets" is that physics trained me to ask what a system's assumptions are, and markets are the only place I have found where you learn within minutes whether you got them wrong.

What transferred was not any specific formula. It was the habit of deriving before fitting. When I needed a fair value for a binary contract on a Brownian price, the probit form was not something I looked up — it is what the assumption produces. When I needed an inventory skew, the CARA derivation gave a closed form with each term meaning something. Every parameter you fit instead of derive is a place where a bad assumption can hide.

The second transfer was falsification. In the laboratory you design the experiment that could kill your hypothesis. Reverse-engineering a market maker's price feed is exactly that: propose a composition, then hunt for the window where it must be wrong. What survives is not proven — it is merely not yet dead, which in both fields is all you ever get.

The difference is the clock. A physics result may wait years for the experiment that tests it. A market opinion is tested by the close.
