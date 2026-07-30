---
layout: page
title: About
permalink: /about/
---

I'm Ishaan Sutaria. I write about language models and the engineering around
them, usually by picking one question I can't answer from memory and tracing it
end to end until I can.

The through-line across these posts: the interesting part is rarely the model.
It's the machinery around it — the tokenizer that lives outside the weights, the
scheduler that decides which requests share a GPU, the verification loop that
catches what an agent got wrong.

## The series

- [What Actually Happens When You Talk to a Language Model](https://github.com/ishaan119/understanding_llm_model_structure)
  — a trace through the seven files that make up a model: tokenizer, embeddings,
  28 layers, and the tied output matrix.
- [Teaching a Small Model to Be a Stoic Philosopher](https://github.com/ishaan119/stoa_llm_model)
  — fine-tuning Qwen2.5-1.5B, SFT then RFT.
- [Serving the Model: Why My First Server Was Slow](https://github.com/ishaan119/serving_llm_models)
  — prefill vs decode, continuous batching, PagedAttention, and a 38× measured gap.
- [MCP Demystified: How Exactly It Works](https://github.com/ishaan119/MCP_Demystefied)
  — JSON-RPC over stdio, the three primitives, the discovery handshake.

Elsewhere: [GitHub](https://github.com/ishaan119).
