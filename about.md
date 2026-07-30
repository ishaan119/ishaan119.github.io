---
layout: page
title: About
subtitle: Who's writing this, and why.
permalink: /about/
description: >-
  Ishaan Sutaria — Solutions Architect at AWS, based in Mumbai. Notes on
  language models and the systems around them, written by taking things apart
  and measuring what they do.
---

I'm Ishaan Sutaria. I'm a Solutions Architect at **AWS**, based in Mumbai, and
I've been building software for about a decade — mostly backend and
infrastructure, lately mostly the machinery around language models.

This site is where I write about the second part. Usually by picking one question
I can't answer from memory and tracing it end to end until I can.

The through-line across everything here: **the interesting part is rarely the
model.** It's the machinery around it — the tokenizer that lives outside the
weights and never changes, the scheduler deciding which requests share a GPU, the
protocol handshake that lets an agent discover what your server can do, the
verification loop that catches what an agent got wrong. The model is one component
in a system, and the system is where the behaviour you actually care about comes
from.

That bias isn't an accident. Most of my career has been spent on the unglamorous
layer — the automation framework, the payment integration, the API that has to
stay up during a traffic spike. When generative AI showed up, the interesting
problems turned out to be in the same place they always are.

## What I do

<ul class="cv">
  <li class="cv-item" data-tint="1">
    <span class="cv-when">2024 —</span>
    <span class="cv-role">Solutions Architect</span>
    <span class="cv-org">Amazon Web Services</span>
    <span class="cv-note">Enterprise RAG systems and AI agents, and the LLM
    optimisation work — fine-tuning, quantisation — that took one deployment's
    infrastructure cost down 60% while improving answer quality. SME for
    Generative AI, Serverless, Developer Experience, and Well-Architected.</span>
  </li>
  <li class="cv-item" data-tint="2">
    <span class="cv-when">2022 – 2024</span>
    <span class="cv-role">Head of Engineering</span>
    <span class="cv-org">LetsVenture</span>
    <span class="cv-note">Owned engineering for India's largest early-stage
    fundraising platform. Automated digital KYC, payments, and document
    processing. Revenue grew 5× with no increase in engineering headcount, and
    NPS moved 50 points.</span>
  </li>
  <li class="cv-item" data-tint="3">
    <span class="cv-when">2019 – 2022</span>
    <span class="cv-role">Software Engineer</span>
    <span class="cv-org">Google</span>
    <span class="cv-note">Technical advisor to strategic GCP customers —
    unblocking architectural bottlenecks, and writing the sample code and
    best-practice material that stopped the same questions recurring.</span>
  </li>
  <li class="cv-item" data-tint="4">
    <span class="cv-when">2018 – 2019</span>
    <span class="cv-role">Software Engineer</span>
    <span class="cv-org">Airbase</span>
    <span class="cv-note">Backend on a fast-growing spend management platform —
    Python and Django, APIs that had to hold up under spikes.</span>
  </li>
  <li class="cv-item" data-tint="5">
    <span class="cv-when">2018</span>
    <span class="cv-role">Co-Founder &amp; CTO</span>
    <span class="cv-org">YourMenu</span>
    <span class="cv-note">Contactless geo-fenced ordering and payments for large
    F&amp;B outlets, zero to one.</span>
  </li>
  <li class="cv-item" data-tint="1">
    <span class="cv-when">2017 – 2018</span>
    <span class="cv-role">Senior Software Engineer</span>
    <span class="cv-org">Crowdfire</span>
    <span class="cv-note">Backend services and growth tooling for a social media
    platform serving millions of users.</span>
  </li>
  <li class="cv-item" data-tint="2">
    <span class="cv-when">2015 – 2016</span>
    <span class="cv-role">Software Development Engineer</span>
    <span class="cv-org">Apple — Special Projects Group</span>
    <span class="cv-note">Python and C++ for verification and validation of a
    full-stack distributed platform.</span>
  </li>
  <li class="cv-item" data-tint="3">
    <span class="cv-when">2012 – 2015</span>
    <span class="cv-role">Software Development Engineer</span>
    <span class="cv-org">Ayla Networks</span>
    <span class="cv-note">Built a Python and Jenkins automation framework that
    cut test development time by 70%, and a performance testing framework that
    surfaced real bottlenecks.</span>
  </li>
</ul>

**M.S. Software Engineering** (Networking), San Jose State University, 2012.

**Patent** — co-inventor on a data streaming service for an IoT platform: a
methodology for moving device data efficiently at scale.

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

- [Stop Prompting. Start Engineering.]({{ '/stop-prompting-start-engineering/' | relative_url }})
  — the five components of a working setup, and the research behind each one.

## Elsewhere

Code for every post lives on [GitHub](https://github.com/ishaan119) — each post
links to the repo where the work happened. I'm on
[LinkedIn](https://linkedin.com/in/ishaansutaria), reachable at
[ishaansutaria@gmail.com](mailto:ishaansutaria@gmail.com), and there's an
[RSS feed]({{ '/feed.xml' | relative_url }}) if you'd rather not rely on an
algorithm.

Everything here is my own view, not my employer's.
