---
layout: page
title: About
subtitle: Why these posts exist, and how they get made.
permalink: /about/
description: >-
  Ishaan Sutaria — notes on language models and the systems around them,
  written by taking things apart and measuring what they do.
---

I'm Ishaan Sutaria. I write about language models and the engineering around them,
usually by picking one question I can't answer from memory and tracing it end to
end until I can.

The through-line across everything here: **the interesting part is rarely the
model.** It's the machinery around it — the tokenizer that lives outside the
weights and never changes, the scheduler deciding which requests share a GPU, the
protocol handshake that lets an agent discover what your server can do, the
verification loop that catches what an agent got wrong. The model is one component
in a system, and the system is where the behaviour you actually care about comes
from.

## How I write these

Three rules I hold myself to:

**Run it first.** Every number in these posts is one I measured on hardware I was
paying for. Where I'm citing someone else's research, it's linked and the caveats
come with it — including when the caveats undercut the headline.

**Trace, don't summarise.** It's easy to describe a transformer from a distance and
say nothing. I'd rather open the actual files, print the actual tensor shapes, and
follow one sentence all the way through.

**Say what I got wrong.** The first serving post exists because my first server was
slow and I didn't know why. That's usually the interesting part.

## The writing

**LLM Internals** — a three-part series following one small model, Qwen2.5-1.5B,
from its files through fine-tuning to production serving:

- [What Actually Happens When You Talk to a Language Model]({{ '/what-happens-when-you-talk-to-a-language-model/' | relative_url }})
  — the seven files that make up a model, and the path a sentence takes through them.
- [Teaching a Small Model to Be a Stoic Philosopher]({{ '/fine-tuning-a-stoic-philosopher/' | relative_url }})
  — fine-tuning that same model, SFT then RFT.
- [Serving the Model]({{ '/serving-the-model/' | relative_url }})
  — why the naive server was slow, and a measured 38× gap after fixing it.

**Protocols** — how agents talk to tools, and to each other:

- [MCP Demystified]({{ '/mcp-demystified/' | relative_url }}) — JSON-RPC over stdio,
  the three primitives, the discovery handshake.
- [A2A Demystified]({{ '/a2a-demystified/' | relative_url }}) — the agent-to-agent
  protocol and the NxM integration problem it solves.

**Agentic Coding** — what actually works when you build software with agents:

- [The Prompt Was Never the Point]({{ '/the-prompt-was-never-the-point/' | relative_url }})
  — the five components of a working setup, and the research behind each one.

## Elsewhere

Code for every post lives on [GitHub](https://github.com/ishaan119) — each post
links to the repo where the work happened. There's also an
[RSS feed]({{ '/feed.xml' | relative_url }}).
