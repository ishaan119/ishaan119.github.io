---
layout: post
title: "Serving the Model"
subtitle: "Why my first server was slow, and what vLLM actually does"
series: "LLM Internals"
date: 2026-06-30
source_repo: https://github.com/ishaan119/serving_llm_models
hero_image: https://github.com/user-attachments/assets/f08557ec-a7d3-4f77-8d40-67a063509188
description: >-
  My 60-line Flask server worked and took 17 seconds per answer. Why decode
  is memory-bound, what continuous batching and PagedAttention fix, and a
  measured 38x throughput gap on one A10G.
---

At the end of the training posts I had a fine-tuned model — a 17 MB LoRA adapter that turns Qwen2.5-1.5B into Stoa. But a model sitting in a folder isn't something anyone can *use*. I wanted a URL I could open in a browser and talk to.

> This is the third post in the series. The earlier two: **[Teaching a Small Model to Be a Stoic Philosopher](https://github.com/ishaan119/stoa_llm_model)** — the fine-tuning itself, SFT then RFT — and **[What Actually Happens When You Talk to a Language Model](https://github.com/ishaan119/understanding_llm_model_structure)** — a trace of the model's internals. You don't need them to follow this one, but I'll point back to both where it helps.

So I did the obvious thing: I wrapped it in a small web server. It worked. It was also slow, and the moment I imagined more than one person using it, it fell apart.

This post is about that gap — between "the model runs" and "the model is served well." It's the part Post 1 explicitly skipped ("we don't cover production serving — that's its own topic"). Here's the topic.

The arc:

1. The naive server I built first, and exactly how slow it was.
2. *Why* it was slow — the prefill/decode split, and why generating text leaves an expensive GPU mostly idle.
3. What vLLM does about it — continuous batching, PagedAttention, prefix caching, CUDA graphs — each tied to a number I actually measured.
4. A live before/after on the same GPU: at 16 concurrent requests, ~38× more throughput.
5. Where vLLM fits, what the alternatives are, and when you genuinely need any of this.

Every number in this post comes from one NVIDIA A10G (24 GB) running the exact same Stoa weights two different ways.

---

## The First Server: Flask + `generate()`

The first version was about 60 lines of Flask. Load the model once at startup, expose a `/api/chat` endpoint, call `model.generate()`, return the text.

```python
@torch.inference_mode()
def generate(messages):
    prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
    inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
    output_ids = model.generate(**inputs, max_new_tokens=512, do_sample=True, temperature=0.7)
    return tokenizer.decode(output_ids[0][inputs["input_ids"].shape[1]:], skip_special_tokens=True)

app.run(host="0.0.0.0", port=8000)
```

This is the most natural thing in the world to write, and it runs. Ask Stoa a question, get a Stoic answer back in about 17 seconds for a full-length response.

Flask itself tells you the problem on startup:

```
WARNING: This is a development server. Do not use it in a production deployment.
```

I was ignoring that warning. But the deeper issues aren't about Flask being a dev server. They're about *how* this serves the model:

- **One request at a time.** A single `model.generate()` call, and by default no real concurrency. Two users? The second waits for the first to completely finish.
- **No streaming.** You stare at nothing for ~17 seconds, then the whole answer appears at once.
- **The system prompt is re-encoded every call.** Stoa's system prompt is ~350 tokens, and every single request pays to process it from scratch.

The 17 seconds bothered me most. The A10G is a serious GPU. Why was a 1.5-billion-parameter model — small by today's standards — taking that long? So I measured.

---

## Why It's Slow, Part 1: Prefill vs Decode

Generating text from a language model is **autoregressive**: it produces one token at a time, and each token depends on all the tokens before it. You can't generate token #200 until you've generated token #199. A 400-token answer is 400 sequential steps. There's no way to parallelize *within* one response.

But those steps come in two very different flavors, and the difference is everything.

```
Your prompt: "I am anxious about a presentation tomorrow."  (≈350 tokens incl. system prompt)
      │
      ▼  PREFILL  — process all 350 prompt tokens in ONE pass
      │            (they're all known up front → done in parallel)
      │
      ▼  DECODE   — generate the answer ONE token at a time
                    token 1 → token 2 → token 3 → ... → token 400
                    (each needs the previous one to exist first)
```

- **Prefill** is the model *reading* your prompt. All 350 tokens already exist, so the GPU ingests them in one parallel matrix multiply that keeps the cores busy. **Compute-bound, and fast.** (Like reading a sentence that's already on the page — you take it in at a glance.)
- **Decode** is the model *writing* the answer. It hasn't been written yet, so it comes one token at a time, and token #352 can't begin until #351 exists. Each step is a full pass through the model to produce a *single* token. **Memory-bound, and slow.** (Like writing a sentence word by word — you can't write the tenth word before the ninth.)

Why is decode memory-bound? Here's the mechanical fact that took me a while to internalize. To produce *one* token, the GPU has to read **every single weight in the model** out of GPU memory (HBM) into the compute cores, do a little math, and produce that one token. For our model that's **3.1 GB of weights read, per token.** (Those weights — the 28 layers of attention and MLP matrices — are exactly what the [model-internals post](https://github.com/ishaan119/understanding_llm_model_structure) pulled apart.)

```
Decode one token ≈ read all 3.1 GB of weights  +  do math for 1 token
                      └─ the expensive part ─┘     └─ almost free ─┘
```

The bottleneck isn't the arithmetic. It's hauling 3.1 GB across the memory bus, 400 times, to write a 400-token answer.

> **"But aren't the weights already loaded?"** They are — they sit in GPU memory the whole time; nothing reloads from disk. But a GPU keeps weights in large, relatively slow memory (HBM), while the math happens in tiny, ultra-fast cores that hold only a few MB at a time. So every token, all 3.1 GB has to be *streamed* from HBM through the cores again. Picture a huge library (HBM) and a small desk (the cores): the books never leave the building, but to use them all you still walk the whole collection to your desk, one armful at a time. Generating one token walks the entire library once.

### Measuring it

I wrote a small profiling script that separates the two phases on the real model. Here's what the A10G reported:

```
PROFILE: naive HF autoregressive serving (batch size 1)
================================================================
model weights resident       : 3.10 GB
prompt tokens (prefill)      : 344
----------------------------------------------------------------
PREFILL  throughput          :     7620 tok/s   (compute-bound)
DECODE   throughput          :     25.2 tok/s   (memory-bound)
DECODE   per-token (TPOT)    :     39.6 ms/token
----------------------------------------------------------------
prefill is 302x faster per token than decode
================================================================
```

**Prefill processes tokens 302× faster than decode produces them.** That single number is the whole story. The expensive part of serving a language model is the one-token-at-a-time decode loop, and it's expensive for a structural reason, not a bug I could fix.

And it checks out against what I felt in the browser: 25 tokens/sec → a ~400-token answer takes ~16 seconds. That matches the ~17s I measured through the live server.

### The GPU is starving

While that decode loop ran, I watched the GPU with `nvidia-smi dmon`:

```
# gpu   sm%   mem%
    0    33    20
    0    32    19
    0    33    21
```

During decode, the **compute units sat around 33% utilization, and even the memory controller was only ~20%.** I'm paying for a 24 GB datacenter GPU and using a third of it. It's idling in a parking lot.

It gets worse. The A10G has about 600 GB/s of memory bandwidth. If decode is purely about reading 3.1 GB of weights per token, the theoretical ceiling is:

```
600 GB/s ÷ 3.1 GB per token ≈ 193 tokens/sec   (for a single stream)
```

I was getting 25. That's **13% of even the single-stream ceiling.** The rest is eaten by per-token overhead: in eager-mode PyTorch, every one of those 400 steps relaunches a pile of small GPU operations from Python, and the GPU sits idle in the gaps between them. That's why even the memory controller was only at 20% — we weren't even keeping the memory bus busy.

So there are actually **two** different inefficiencies here, and they matter for what comes next:

1. **Batch size 1 wastes the GPU on principle** — decode is memory-bound, so the compute cores have nothing to do.
2. **Our single stream is also sloppy** — per-step Python/launch overhead means we don't even saturate the memory bus we're bottlenecked on.

---

## Why It's Slow, Part 2: The Batching Insight

Here's the realization that reframes the whole problem.

> Reading 3.1 GB of weights costs the same whether you're producing one token for one user, or one token each for thirty-two users.

The weights are read once and applied to whatever you've got. At batch size 1, you pay the full memory-bandwidth bill to produce a *single* token. If you instead had 32 sequences in flight, that *same* weight read would produce 32 tokens. Your throughput goes up ~32× for almost no extra memory traffic, and suddenly the compute cores have real work to do.

This is the key to serving LLMs efficiently: **you don't make a single response faster, you make the GPU serve many responses at once.** Decode is memory-bound, so batching is close to free until you start running out of compute or memory.

So why doesn't the naive server just batch? Because real batching is hard in ways that aren't obvious:

- **Requests arrive at different times.** User A is mid-answer when user B shows up. Do you make B wait for A to finish before starting a batch? (That's "static batching," and it wastes time.)
- **Requests finish at different times.** In a batch of 8, if one answer is 50 tokens and another is 500, the whole batch is stuck until the longest one finishes.
- **Memory is unpredictable.** Each sequence needs a growing **KV cache** (the attention keys/values for every token so far). You don't know up front how long each answer will be, so you don't know how much memory the batch will need.

These three problems are exactly what a real serving engine solves. Which brings me to vLLM.

---

## What vLLM Does

[vLLM](https://github.com/vllm-project/vllm) is an inference engine built specifically for this. Four ideas matter, and I'll tie each to something I measured.

### 1. Continuous batching

Instead of forming a fixed batch and waiting for it to finish, vLLM schedules at the level of a *single decode step*. Every step, it looks at all the sequences currently in flight, runs one token for all of them together, and then — crucially — lets finished sequences leave and new requests join *mid-flight*. No request waits for a batch to form; none holds up the others when it finishes.

The analogy that made it click for me: **it's a carpool, not a taxi rank.** The trip (reading 3.1 GB of weights) is happening anyway. Continuous batching fills the car with as many passengers as show up, and people get on and off at every stop, instead of running one passenger per trip.

This is the single biggest reason vLLM is faster under load.

### 2. PagedAttention

The blocker to packing many sequences together is the KV cache. Naively, you'd reserve one big contiguous block of memory per sequence, sized for the longest answer it *might* produce. That wastes enormous amounts of memory (most answers are short) and fragments what's left.

PagedAttention borrows the idea straight from operating systems: **virtual memory paging.** The KV cache is split into small fixed-size blocks that don't have to be contiguous. A sequence gets blocks allocated on demand as it grows, and they can sit anywhere in memory. Almost no waste, almost no fragmentation — so you can fit far more concurrent sequences into the same VRAM.

I didn't have to take this on faith; vLLM prints it at startup. With the KV cache capped at just **40% of the GPU**, it reported:

```
GPU KV cache size: 175,920 tokens
Maximum concurrency for 4,096 tokens per request: 42.95x
```

That's ~43 full-length conversations held in memory *at once*, on a slice of one GPU. The naive server holds exactly one.

### 3. Prefix caching

Remember that ~350-token system prompt that gets re-encoded on every request? vLLM can cache the KV state of a shared prefix and reuse it. Stoa's system prompt is identical on every call, so it gets prefilled once and every subsequent request skips it. (This is the same "wasted system-prompt tokens" problem I flagged while [building the SFT data](https://github.com/ishaan119/stoa_llm_model) — here it finally gets solved for free.)

### 4. CUDA graphs and fused kernels

This is what fixes the *second* inefficiency — the 13%-of-ceiling problem. Instead of relaunching hundreds of small operations from Python on every decode step, vLLM captures the whole step as a **CUDA graph** and replays it as one unit, and it uses fused attention kernels (FlashAttention-style). The per-step overhead largely disappears, so even a *single* stream runs much closer to the hardware ceiling.

You can see this one directly: even with no concurrency at all, vLLM decoded at **120 tok/s vs the naive server's 25** — about 62% of that 193 tok/s ceiling, versus 13%. Same model, same GPU. The difference is purely that vLLM isn't leaving the GPU idle between steps.

---

## How Concurrent Requests Flow

It helps to see the two designs side by side. Here's the naive server with four users showing up at once:

```
 user A ─▶┐
 user B ─▶│   ┌────────────────────────────────────────────┐
 user C ─▶├──▶│  ONE model.generate() at a time              │
 user D ─▶┘   │  run A ─done▶ run B ─done▶ run C ─done▶ run D │ ◀ everyone queues
             └────────────────────────────────────────────┘
                       GPU ~33% busy the entire time
```

Each request runs start to finish before the next one begins. The GPU reads all 3.1 GB of weights for *every token of every request*, one user at a time. Throughput is pinned at a single stream; the queue just gets longer. The 16th user waits for the 15 ahead of them.

Now vLLM:

```
 user A ─▶┐                   ┌─ scheduler ───────────────┐
 user B ─▶│   OpenAI-style    │  running batch: [A B C D]  │
 user C ─▶┼──── HTTP ────────▶│                            │
 user D ─▶┘   (streaming)     └─────────────┬──────────────┘
                                            │  one decode step
                                            ▼
                          ┌──────────────────────────────────────┐
                          │  GPU: read the 3.1 GB of weights ONCE  │
                          │   → emit 1 token for A, B, C, D        │
                          └──────────────────┬─────────────────────┘
                                             │
              paged KV cache: each sequence's tokens live in small,
              non-contiguous blocks, allocated on demand (PagedAttention)
                                             │
        tokens stream back to all four  ◀────┘     (repeat, every step)

   A finishes → its blocks are freed, it leaves the batch
   user E arrives → joins the *next* step, nobody waits
```

Same weight read, four tokens out. Sequences join and leave the running batch every single decode step (continuous batching), and their KV caches are packed into paged blocks so dozens fit at once (PagedAttention). That's the whole trick: the expensive part — moving the weights across the memory bus — is shared across everyone in flight, instead of repeated per user.

---

## Running vLLM

Starting it was one command:

```bash
vllm serve models/stoa-rft-merged \
  --served-model-name stoa \
  --port 8001 \
  --gpu-memory-utilization 0.4 \
  --enable-prefix-caching
```

It comes up as an **OpenAI-compatible API**, which is a quiet but real advantage: any code that already talks to the OpenAI API talks to your self-hosted Stoa with just a URL change.

One gotcha worth knowing: vLLM **pre-allocates** its KV-cache pool at startup based on `--gpu-memory-utilization` (90% by default). I wanted the naive HF server running on the *same* GPU for a live toggle, so I capped vLLM at 40% — that lets the two coexist (vLLM ~10 GB + HF ~3.5 GB on a 24 GB card) and is exactly why the PagedAttention number above said "40% of the GPU."

---

## The Before/After

I built a little UI with a **Local (HF) | vLLM** toggle and a benchmark button that fires N identical requests at once. Same model, 128 tokens each, on one A10G:

| Concurrency | Backend | Throughput | p50 latency | Max latency |
|------------:|---------|-----------:|------------:|------------:|
| 1  | Local (HF) | 33 tok/s | 3.9 s | 3.9 s |
| 1  | **vLLM**   | **120 tok/s** | 1.1 s | 1.1 s |
| 4  | Local (HF) | 39 tok/s | 9.8 s | 13.0 s |
| 4  | **vLLM**   | **461 tok/s** | 1.1 s | 1.1 s |
| 16 | Local (HF) | 40 tok/s | 28.8 s | **51.4 s** |
| 16 | **vLLM**   | **1,506 tok/s** | 1.4 s | 1.4 s |

Three things fall out of this table:

1. **Even at one request, vLLM is ~3.6× faster** (120 vs 33 tok/s) — that's the CUDA-graph/kernel win, nothing to do with batching.
2. **The naive server's throughput is flat** (~33→40 tok/s) no matter how many users show up. It serves one at a time, so extra requests just queue. Watch the latency column instead: 3.9 s → 13 s → **51 s**. The 16th user waits almost a minute.
3. **vLLM's throughput scales** (120 → 461 → 1,506 tok/s) while latency barely moves (~1.1 → 1.4 s). That's continuous batching: one weight-read, many tokens. At 16 concurrent requests it's a **~38× throughput gap.**

There's a fourth number that doesn't fit the table but matters for how *responsive* it feels — **time to first token (TTFT)**. Through the streaming UI:

- Local: **713 ms** before the first token appears
- vLLM: **40 ms**

With vLLM the answer starts almost instantly and streams; with the naive server you wait the better part of a second just to see it *begin* (and historically, with no streaming at all, you waited for the entire thing).

---

## So Is vLLM Just nginx for Models?

I wondered this out loud while building it, and the answer is *no, and the reason is instructive.*

nginx is a reverse proxy and load balancer. It accepts many connections, queues them, and routes them to backends. But it never does the actual work, and it never *merges* the work of two requests — request A and request B are handled independently, just efficiently shuffled around.

vLLM's whole point is the opposite: it **fuses** many requests into one GPU computation. Request A and request B literally share the same weight-read in the same decode step. That's a compute-scheduling problem on a scarce GPU, which nginx has no concept of.

The cleaner mental model: **they're complementary layers, not substitutes.** In a real deployment you'd often put nginx *in front of* vLLM — terminating TLS, routing, load-balancing across several vLLM replicas. nginx handles connection-level concerns; vLLM handles model-execution concerns.

```
              ┌─────────┐      ┌──────────────┐
  users  ───▶ │  nginx  │ ───▶ │ vLLM replica │ ─▶ GPU
              │ (proxy) │ ───▶ │ vLLM replica │ ─▶ GPU
              └─────────┘      └──────────────┘
            connection-level        model-execution
```

---

## The Landscape: Other Ways to Serve

vLLM isn't the only option, and it isn't always the right one. Roughly three families:

**Self-hosted, high-throughput engines** — same goals as vLLM, different tradeoffs:
- **TGI (Text Generation Inference)** — Hugging Face's server; also does continuous batching and FlashAttention. Production-grade, usually run as a Docker container.
- **SGLang** — newer; its "RadixAttention" is especially good at sharing prefixes across many requests (handy for heavy prompting / structured generation).
- **TensorRT-LLM** — NVIDIA's; the fastest on NVIDIA hardware if you're willing to compile model-specific engines ahead of time. Most setup effort of the bunch.

**Local / on-device** — for running on a laptop or at the edge, single user:
- **Ollama** and **llama.cpp** — dead simple, GGUF-quantized weights, run happily on CPU or a small GPU. This is how I'd actually run Stoa on my MacBook (fold the adapter into the base weights, convert to GGUF, done).
- **MLX** — Apple Silicon native, if you're staying in the Mac ecosystem.

These trade throughput for simplicity and portability. They're not built to saturate a datacenter GPU with 40 concurrent users; they're built to make one user's life easy.

**Managed / serverless** — don't host anything yourself:
- **AWS Bedrock, SageMaker, Together, Fireworks, Modal, Replicate, Baseten** — you hand them a model (or use one they host) and get an endpoint. You trade control and per-token cost for zero ops. I already used Bedrock to *generate* Stoa's training data; serving our own fine-tuned weights there would mean Bedrock Custom Model Import, which is its own rabbit hole.

---

## When Do You Actually Need This?

The honest answer, and the one I'd want someone to tell me: **for a single-user demo, the naive server is fine. Don't over-engineer it.** 33 tok/s for one person is perfectly usable, and you saved yourself a day of setup.

vLLM (or TGI, or a managed endpoint) earns its keep the moment any of these is true:

- **Concurrency** — more than one or two people using it at once. This is the big one; the table above is the argument.
- **Cost per token** — if you're paying for the GPU by the hour, 38× more throughput is 38× fewer GPU-hours for the same traffic.
- **Latency SLAs** — you need answers to start streaming in tens of milliseconds, not hundreds.

And if none of those is true — if you just want Stoa on your laptop — the answer isn't vLLM at all. It's Ollama.

A rough decision tree:

```
Just you, on your machine?            → Ollama / llama.cpp / MLX
Many users, you own a GPU?            → vLLM / TGI / SGLang
Many users, don't want to run infra?  → Bedrock / SageMaker / Together / ...
A quick demo for one person?          → the naive server is genuinely fine
```

---

## What I Actually Understand Now

Before this, "serving a model" sounded like a deployment chore — wrap it in an API, done. It isn't. Serving is where the *shape* of the computation meets the *shape* of the hardware, and they don't naturally fit.

Generating text is sequential and memory-bound: one token at a time, each one dragging the entire model across the memory bus while the compute cores idle. A single stream can't use a modern GPU. The only way to use it is to serve many sequences at once — and doing *that* well, with requests constantly arriving and finishing and each needing an unpredictable amount of cache memory, is a real systems problem. Continuous batching solves the scheduling; PagedAttention solves the memory; CUDA graphs solve the per-step overhead. That's vLLM.

The measurements made it concrete in a way I won't forget: same model, same GPU, **38× more throughput** under load, just by serving it properly. The model didn't get smarter. The serving got out of its own way.

---


**Earlier in this series:**

- [Teaching a Small Model to Be a Stoic Philosopher](https://github.com/ishaan119/stoa_llm_model) — the fine-tuning itself, SFT then RFT.
- [What Actually Happens When You Talk to a Language Model](https://github.com/ishaan119/understanding_llm_model_structure) — a trace of the model's internals: tokenizer, embeddings, the 28 layers, and the files that make up a model.
