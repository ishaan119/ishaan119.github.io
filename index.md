---
layout: home
---

## How these get written

I pick one question I can't answer from memory, then chase it until I can — reading
the source, running the thing, measuring what it does. The post is the trace of
that, written the way I'd have wanted to read it before I started.

Which means there's no summarising here from a distance. If a post says decode
runs at 25 tokens/sec, I measured 25 tokens/sec on a GPU I was paying for. If it
says the embedding layer is just row-indexing into a matrix, I checked that the
two paths return bit-identical tensors.

Most of these started as a README in the repo where I did the work — the code is
still linked from every post.
