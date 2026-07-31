---
layout: post
title: "Stop Prompting. Start Engineering."
subtitle: "What actually makes coding agents work"
series: "Agentic Coding"
date: 2026-07-30
featured: true
description: >-
  I went looking for the perfect prompt for coding agents. There isn't one.
  What the fast developers have is a system — five components, most buildable
  in under an hour. Here it is.
---

I went looking for the prompt.

That was the premise: somewhere out there was a way of phrasing things — a magic preamble, a role-play trick, the right adjectives — that separated people shipping real work with coding agents from people fighting them.

There was no prompt.

---

## You Cannot Feel This Working

For months I couldn't tell whether any of this was helping.

Some days felt like a superpower. Other days I'd spend forty minutes correcting an agent on a problem I could have solved in ten. My output volume was up and my confidence in that output was down. When I was honest about where the time actually went — the re-reading, the corrections, the work that looked finished and wasn't — I wasn't faster. I was busier.

That's the trap, and it's structural. Generation is visible and fast. The cost lands later, spread across correction cycles, which is exactly where it hides from your sense of speed. So "I'll try things and keep whatever feels faster" isn't a plan. Your feelings are the one instrument in the setup that's known to be broken.

Which moves the goal. If your own read on it is unreliable, getting better at prompting is the wrong target — you can't tune what you can't measure. What you can do is build the thing that makes the agent's work checkable without you.

The other pattern I kept hitting: **context decides the ceiling.** Greenfield and mechanical work goes well — hand it over, run it wide. Complex changes in a large codebase I know intimately are where the gains evaporate and where I have to earn them back through structure. That difference is a delegation guide, not a flaw in the tools.

And agents amplify whatever engineering you already have. Real tests, fast CI, small batches — those convert agent speed into throughput. Without them, the speed converts into instability. Agents don't fix a broken pipeline. They find it faster.

Here's the shape of what actually worked. Five parts of one machine, each covering a different failure mode:

```
                  ┌─────────────────────────────────────┐
                  │              YOU                    │
                  │   specs, judgment, direction        │
                  └──────────────┬──────────────────────┘
                                 │
        ┌────────────────────────▼─────────────────────────┐
        │  PROMPTS    how you ask                          │  free
        │             scope · source · pattern · symptom   │
        ├──────────────────────────────────────────────────┤
        │  MEMORY     what it knows without being told     │  ~1 hour
        │             instructions · skills · hooks        │
        ├──────────────────────────────────────────────────┤
        │  GATES      what catches mistakes, not you       │  safety net
        │             fresh-eyes review · CI · specialists │
        ├──────────────────────────────────────────────────┤
        │  WORKERS    parallelism that scales you          │  multiplier
        │             worktrees · fan-out · overnight runs │
        ├──────────────────────────────────────────────────┤
        │  FLYWHEEL   how the system improves itself       │  compounds
        │             capture tricks · measure · prune     │
        └──────────────────────────────────────────────────┘
```

It's a hierarchy of leverage. Prompts help this afternoon. Memory helps every session forever. Gates are what let you stop reading every line. Workers multiply you. The flywheel is the only component that compounds.

Most people build only the first one, hit a ceiling, and conclude the tools are overhyped or overhated depending on their mood.

My first model server was slow, and my instinct was to make the single request faster. Wrong instinct — the win came from restructuring so the GPU served many requests at once. Same here. **You don't make a single prompt better. You build the system the prompts run inside.**

---

## Talk to It Better

Zero setup, pure craft. Four habits.

### Bake verification into every prompt

An agent stops when the work *looks* done. If there's no check it can run itself, then **you** are the verification step — and that's the loop that makes agents feel fast and measure slow.

```
# BEFORE (you are the verification loop)
implement email validation

# AFTER (the loop closes itself)
Write validateEmail in src/utils/validate.ts.
Test cases:
  user@example.com -> true
  user@.com        -> false
  ""               -> false
Write the tests first, then implement.
Run the tests and show me the output.
If anything fails, fix the root cause -
don't weaken the test.
```

Concrete pass/fail cases, the command that proves it, and *"show me the output"* — evidence, not assertions. Without that last clause you get "All tests pass!" as a claim, and claims are what you're eliminating.

`don't weaken the test` isn't decoration. Weakening tests to make them pass is the number one way agents cheat; there's a CI gate for it further down.

> *"If you haven't seen it run, it's not a working system."* — Simon Willison

### The four ingredients

Vague prompts don't fail loudly. They cost you three correction rounds — exactly the cost that hides from your sense of speed. Embed the intuition you already have as specifics:

- **Scope** — which file, which scenario
- **Source** — where the answer lives ("check the git history of X")
- **Pattern** — an existing example to imitate
- **Symptom** — what you observed, and what "fixed" looks like

The missing ingredient is almost always **pattern** or **symptom**. Scope and source come naturally, because they're what you'd tell a colleague. Pattern — "here's the code that already does this correctly" — is what turns a plausible invention into something that matches your codebase.

When you're exploring, vague is *correct*. "What would you improve about this file?" is a great prompt.

### The two-strike rule

When you correct an agent and it fails, that failed attempt **stays in the context window**, anchoring everything after it. Correct it again and there are two bad attempts in there. You're no longer collaborating with a fresh mind — you're collaborating with something that has read its own wrong answers three times.

Two failed corrections on the same issue → clear the session, re-prompt, and fold in what you learned:

```
Refactor the session store to Redis.
NOTE: the naive approach fails because
middleware reads the session before hydration -
handle init order explicitly.
Put the Redis client init in a factory that
middleware and routes both import.
```

That `NOTE` is the technique: what you learned from the two failures, promoted from a correction into context. First-try fix, because now it's a constraint instead of an argument.

Same principle, different symptom: **one task, one session.** The side question's context doesn't disappear when you're done with it.

### Plan before you build

One bad line of code is one bug. One bad line of *plan* is hundreds of bad lines of code.

I can't review 2,000 lines of diff a day. I can review 200 lines of plan — and at that stage, cutting scope creep costs one keystroke instead of a refactor.

```
# 1. Explore (read-only / plan mode)
Read src/auth and explain how sessions work.
Don't change anything.

# 2. Plan (still read-only)
I want to add Google OAuth. What files change?
Create a detailed plan in PLAN.md.

# 3. YOU edit PLAN.md
#    Cut scope creep. Add constraints.

# 4. Implement (fresh session)
Implement PLAN.md. Write tests for the callback
handler; run the suite.
Do not deviate from the plan - if something needs
changing, tell me instead of improvising.
```

Step 3 is not a rubber stamp: **when you edit the plan, delete at least one thing.** Step 4's *tell me instead of improvising* converts a silent architectural decision into a question.

Skip all of this when the diff fits in one sentence.

---

## Teach It Your World

The habits above help for one session. This is an hour of setup that **every future session inherits**.

### The instructions file

Every agent tool has one — `CLAUDE.md`, `AGENTS.md`, `.cursorrules`. Three rules:

1. **Per line, ask: "would removing this cause a mistake?"** No → cut it.
2. **Every line is earned by an observed failure.** Nothing speculative.
3. **No "never do X" lists.** They backfire. Reframe as an incentive.

The counterintuitive part: **bloated files get ignored.** Past a certain length the model half-attends to all of it. A 200-line instructions file isn't a thorough 20-line one; it's a *worse* one, because your three important rules are diluted by 197 lines of speculation.

The diagnostic: **if the agent keeps violating a rule, your file is too long.** Not too permissive. Too long.

A real one, complete:

```markdown
# Commands
- Build: npm run build
- One test: npx jest path/to/test
- Always typecheck after code changes

# Gotchas (each earned by a real failure)
- Tests need Docker: `make db-up` first
- Dev server logs magic-link emails to stdout -
  use them to test sign-in flows
- Auth middleware runs BEFORE body parsing

# Style
- ES modules, not CommonJS
- Prefer single tests over the full suite

# Testing
- The only thing worse than a failing test is a
  reduction in test coverage.
```

That last line is rule 3 in action — a framing of what good looks like, which is what actually steers behaviour.

### Skills: your workflows, on demand

> Anything you've prompted three times is a skill.

A skill is a markdown file that becomes a slash command, loaded **only when invoked** — so it costs zero context otherwise. That's the clean split: the instructions file is what's *always* true, skills are what's *sometimes* needed. It's why you can have thirty skills and a seventeen-line instructions file.

```markdown
# .claude/skills/fix-issue/SKILL.md
---
name: fix-issue
description: Fix a GitHub issue end-to-end
---
Fix GitHub issue: $ARGUMENTS

1. Get issue details (gh issue view)
2. Search the codebase for relevant files
3. Write a failing test that reproduces it
4. Implement the fix
5. Run lint + typecheck + full suite
6. Show me the test output
7. Commit: "fix: <description> (#issue)"
8. Push and open a PR

Do NOT merge. Do NOT close the issue.
```

Then `/fix-issue 1234`. Note it has verification baked in — failing test first, show me the output, explicit boundaries. A skill is where a good prompt goes to become permanent.

Good first skills: `fix-issue` · `tdd-cycle` · `deploy` · `review-pr` · `spike-and-report`.

One caution: **vet community skills like dependencies.** A skill is instructions executing in your repo with your permissions.

### Hooks: instructions are advisory, hooks are law

An agent can forget an instruction. It cannot skip a hook, because **the harness runs hooks, not the model.** No negotiation, no context window, no "I'll skip the lint step since the change is small."

Instructions are a note on the fridge. Hooks are the lock on the door.

So **anything you've had to write in your instructions file twice should be a hook.** Twice means the instruction isn't working. Good candidates: lint or format after every edit, block commits unless tests pass, protect generated code and migrations.

Don't write the config by hand — describe the rule in English and let the agent generate it:

```
Write a hook that blocks any commit unless
`npm test` exits 0.
```

Then **verify the hook actually fires.** A hook you haven't seen block something is a hook you don't have.

### Make your dev loop agent-readable

**Agents debug by reading output.** If your dev server logs to a terminal the agent can't see, it's flying blind — and a blind agent guesses, which is where invented fixes come from.

- **Fast** — a 3ms check beats a 5s compile. Note the asymmetry: a crash is fine, a **hang is fatal**. A crash produces an error the agent can read.
- **Honest errors** — `already running (make tail-log)` beats a port-bind stack trace.
- **Observable** — output lands in a file the agent can read.

```makefile
dev:
	@test -f .dev.pid && \
	  echo 'already running (make tail-log)' \
	  || (npm run dev > dev.log 2>&1 & \
	      echo $$! > .dev.pid)

tail-log:
	@tail -n 100 dev.log
```

Then advertise it in the instructions file — the agent can't use what it doesn't know exists. One line about where the logs live, and one about how to complete a login flow without asking you, is the difference between an agent that tests a signup end-to-end and one that stops to wait.

### Permissions that scale with trust

After the tenth approval prompt you aren't reviewing, you're reflexing. That's strictly worse than a curated allowlist, because it *feels* like oversight while providing none.

```
# Step 1: allowlist the routine
allow: ["npm run lint", "npx jest *", "git commit *"]
deny:  ["Read(.env*)", "rm -rf *", "curl * | sh"]

# Step 2: classifier-reviewed autonomy
$ claude --permission-mode auto -p 'fix all lint errors'

# Step 3: sandbox for unattended work
$ docker run -v $PWD:/work ... agent

# Rule of thumb:
#   supervised  -> allowlist
#   unattended  -> sandbox + scoped creds
```

Three real unattended risks: destructive commands, secret exfiltration, and your machine used as an attack proxy. The mitigation isn't vigilance — vigilance is what fails at 2am. It's a **sandbox plus scoped test credentials with hard budget caps.**

---

## Trust, but Verify

The pieces above make the agent effective. This is what lets you stop reading every line.

### Adversarial review: fresh eyes on every diff

Self-review fails **structurally**. When a model reviews its own work, the reasoning that produced the change is sitting right there in context, and it reads as justification. A fresh context sees only the diff and the criteria.

```
# Level 1 - almost magical:
Look at this diff again with fresh eyes.
Report only issues affecting correctness.

# Level 2 - the competition:
Ask two subagents to review this work. Whoever
finds the largest number of serious issues gets
five points. Correctness only - not style.

# Level 3 - cross-model:
# (paste the diff into a different provider)
Review this diff for edge cases, race conditions,
and security issues. Be specific: file, line,
failure scenario.
```

Level 2 sounds absurd — a meaningless prize, five imaginary points. It works anyway. Level 3 has the best hit rate in my experience, and it makes sense: a different provider's model has different blind spots.

The one rule: **always scope the reviewer.** "Review this code" gets you unbounded stylistic opinions, and then you over-engineer chasing findings that were never problems.

### Custom specialists: a reviewer in five lines

```markdown
# .claude/agents/security-reviewer.md
---
name: security-reviewer
description: Reviews code for security vulnerabilities.
  Use proactively after code changes.
tools: Read, Grep, Glob
model: opus
---
You are a senior security engineer. Review for:
- Injection (SQL, XSS, command)
- Auth/authz flaws, privilege escalation
- Secrets in code, insecure input handling
Give specific line references and fixes.
```

Three worth having on day one:

- **security-reviewer** — read-only tools, best model, hunts authz and injection
- **test-writer** — adds edge-case tests, *cannot touch source*
- **cheap-researcher** — cheapest model, reads 20 files, returns 500 words

Two fields carry the design weight. **`tools` is the safety lever** — a reviewer that can't edit can't "helpfully" fix what it finds. **`model` is the cost lever** — the researcher summarising twenty files doesn't need your best model; the security reviewer does.

### Visual verification: give it eyes

For UI work the check is your eyes, which makes it a human bottleneck on every iteration. So give the agent eyes: let it start the dev server, screenshot the page, compare against the reference design, **list every visual difference**, fix each one, and re-screenshot until they match.

That "list every difference" step is what makes it work — it forces an explicit comparison instead of a vibe check. You walk away; it converges. This is the one browser-automation integration worth wiring up. Everything else stays CLI, because CLI output is text an agent can read.

### CI gates tuned for agent-generated code

Here's the thing that should reshape your pipeline: **agent code fails differently from human code.** The shallow problems mostly went away — syntax errors, simple logic bugs. The deep ones got substantially worse: privilege-escalation paths and architectural flaws, both up multiples on the human baseline.

That mix is *precisely inverted* from what code review catches well. Reviewers reliably spot a typo and reliably skim past a subtly broken authorisation path in a 900-line PR.

Two more shifts worth designing for. Security performance stays roughly flat regardless of how new or large the model is, even as functional correctness keeps improving — so the next model will write better code, but not more secure code. And agents add without consolidating: duplication climbs, and refactoring work drops off sharply.

Three gates catch specifically these things:

```
Add a CI job that fails any PR where test coverage
drops below the main branch. Post the delta as a
PR comment.

Add gitleaks (secret scan) and semgrep (SAST) to
our PR pipeline. Default rulesets; fail on high
severity only.

Add jscpd to CI: warn at 5% duplication, fail at
10%. Exclude generated code.
```

- **Coverage ratchet** — catches the #1 agent cheat: weakening tests to pass.
- **Secret scan + SAST** — because security doesn't improve on its own.
- **Duplication check** — the direct counter to the refactoring collapse.

Then make it real:

```
Open a draft PR that deletes one test.
Show me the pipeline failing.
```

> A gate you haven't seen fail is a gate you don't have.

---

## Let Go

### Parallel worktrees

One git worktree per task = isolated checkouts. Review task one while task two runs.

```bash
$ git worktree add ../app-oauth -b oauth
$ git worktree add ../app-perf  -b perf

# then start an agent in each, simultaneously
$ cd ../app-oauth && npm ci && <start your agent>

# cleanup when merged
$ git worktree remove ../app-oauth
```

Ground rules, all earned the hard way:

- **3–4 workstreams max.** Your review bandwidth saturates long before compute does.
- **Clean baseline first** — install, lint, test green.
- **Watch shared state outside the repo** — database, Redis, ports. Worktrees isolate files, not your dev database.
- **Never two agents in one file.**

Worth the contrarian datapoint: Mitchell Hashimoto deliberately runs **one** agent, active maybe 10–20% of his day, and ships significant features. More parallelism is only more output if your review capacity absorbs it.

### Headless fan-out for migrations

For the 200-file mechanical migration you've deferred for a year, one scripted agent call per file:

```bash
# 1. Build the work list
$ grep -rl 'enzyme' src --include='*.test.tsx' > files.txt

# 2. Pilot on three files, read the diffs, THEN:
for f in $(cat files.txt); do
  claude -p "Migrate $f from enzyme to React
    Testing Library. Run the file's tests.
    Reply only OK or FAIL: reason." \
    --allowedTools "Edit,Bash(npx jest *),Bash(git commit *)" \
    >> migrate.log
done

# 3. Triage
$ grep -c 'OK' migrate.log
$ grep 'FAIL' migrate.log   # by hand
```

`Reply only OK or FAIL: reason` is the design decision that makes this work — every invocation becomes a **parseable unit of work**, so 200 files is one grep instead of 200 diffs.

Don't skip the pilot. A bad prompt at scale is 200 bad commits.

### The Ralph loop

The degenerate technique that works embarrassingly well: loop one agent over one prompt until the project builds.

```bash
# loop.sh - run INSIDE a container
#!/bin/bash
while true; do
  cat PROMPT.md | claude -p --dangerously-skip-permissions
  make check 2>/dev/null && break
done
```

`PROMPT.md` is the agent's entire brain: study the spec and the fix plan, pick the single most important unfinished task, implement it for real with no stubs, run build and tests, fix all failures, update the plan, commit, stop.

Why does something this dumb work? **Backpressure.** The compiler and test suite reject bad iterations automatically, and that rejection *is* the steering. It's "close the loop" taken to its limit.

Scope it honestly — Huntley, who invented it, gets **greenfield bootstrapping to about 90%**, wouldn't run it on an existing codebase, and calls claims of 100% engineer-free work "horseshit."

Two failure modes: **doing too much at once**, and **premature victory** — a later session sees partial progress and declares the job done. The fixes are structural: one feature per session, every session ending mergeable, and a bearings ritual at session start (`pwd`, git log, read the progress file, smoke test *before* writing new code).

⚠️ **Container or sandbox only.** This runs unattended with permissions off. Watch the first ten iterations. Expect some broken mornings — `git reset --hard` is a legitimate tool here.

### The end-of-day agent

The cheapest continuous win here. Spend the last fifteen minutes launching work that runs overnight. **Not shipping. Reporting.**

```
Investigate issue #482 (intermittent 502s on
/export). Reproduce if possible, find the root
cause, write findings + proposed fix to
docs/investigations/482.md
Do NOT push, comment on the issue, or open a PR.
Report only.
```

> **Overnight agents write to files. Humans ship.**

Nothing pushes, nothing comments publicly, nothing merges. Worst case is a wasted night and a file you delete. Best case is a **warm start**: read the report with coffee, decide, direct.

---

## The Flywheel: The Only Part That Compounds

### Capture what it invented

The agent just solved something hard, improvising techniques that aren't in your instructions file. Clear the session and all of it is gone. One prompt keeps it:

```
Write a short report of the non-obvious techniques
you used in this session - things a future agent
(or future me) wouldn't know to try. Format as
bullets I can paste into the instructions file.
```

Then promote the useful ones into the instructions file or a skill. The monthly version of the same move is the one that really pays: have the agent read your last 20 CI failures, name the 3 most common mistakes, and propose a rule or hook that prevents each. That's the flywheel eating its own errors — and it's how one well-tuned setup outperforms a fleet of generic ones.

### The scorecard: your gut is not a metric

Your perception is the broken instrument, so instrument around it.

```
Write scripts/agent-scorecard.sh that reports, for
the last 30 days:
1. Churn: % of added lines modified again within
   14 days (git log --numstat)
2. Rework: commits containing fix/revert/oops as
   % of all commits
3. Coverage now vs 30 days ago
4. Count of reverted merges
Print a table. Add a Makefile target.
```

**Capture the baseline now**, before you build anything else. It's the one step that's impossible to do retroactively.

### The monthly prune: systems must shrink too

A system that only grows eventually ignores itself. An instructions file that's too long gets half-ignored, so **every stale line you keep degrades the lines that matter.**

- Per line: *"does the agent still make this mistake without it?"* No → delete.
- Skills uninvoked in 30 days → delete.
- Hooks that never fire → audit.
- Workarounds for bugs that got fixed → gone.

Get the analysis from the agent, but keep the decision — pruning is a judgement call about your own codebase.

One force makes this mandatory rather than nice-to-have: **newer models need fewer rules.** A file tuned for last year's model is over-constrained today, and half of what you wrote was compensating for a weakness that no longer exists.

---

## Five Failure Patterns

**1. The kitchen-sink session.** Task A, side question, back to A. → One task, one session.

**2. Correcting over and over.** The context is poisoned and you're arguing with the agent's own bad attempts. → Two-strike rule.

**3. The bloated instructions file.** So long the agent ignores the rules you care about. → Monthly prune. The tell: it keeps violating a rule you wrote down.

**4. The trust-then-verify gap.** Plausible code, unhandled edge cases — and this is the failure mode that got *worse*. → Verification in every prompt + adversarial review.

**5. Shipping what you don't understand.** → Back it out, or make it teach you. **You are the DRI.** When it pages at 3am, "the agent wrote it" is not a diagnosis.

---

## What I Actually Understand Now

Before I looked into any of this, if you'd asked me how to get more out of a coding agent I'd have said "write better prompts." Technically true, not useful — and it frames the whole thing as a communication problem, which sends you off collecting phrasing tricks.

A coding agent is a component, not a colleague. It generates plausible work quickly and has no idea whether that work is correct. Everything that determines your output is the machinery around it: verification it can run without you, memory so it doesn't relearn your world every morning, gates that catch the specific things it gets wrong, isolation so it can run in parallel, and a capture loop so what it figures out today is still there next month.

Three things I'd underline:

**The failure mode inverted, and nobody updated their review process.** Fewer typos, far more broken authorisation paths and architectural flaws. Human review is well-calibrated for the old distribution and badly calibrated for the new one. That gap is what CI gates are for — it isn't something you can be more careful about.

**Structure beats vigilance.** Instructions get forgotten; hooks execute. Approval prompts become reflexes; allowlists and sandboxes hold. Every durable improvement in my setup was converting an intention into a mechanism.

**The compounding is the whole game.** Better prompts help this afternoon. An instructions file helps every session forever. A flywheel makes next month better without your involvement.

Same lesson as [serving](https://github.com/ishaan119/serving_llm_models), where 38× more throughput came from getting the serving out of the model's way rather than from a better model. Here too, the model doesn't get smarter. You just stop being the bottleneck in your own loop.

> Your job is no longer to write code. It's to build a system that writes correct code.

Start with verification on your very next prompt. It costs nothing, and every other component is downstream of it.

---

## Go Deeper

- [Claude Code best practices](https://code.claude.com/docs)
- Simon Willison — [Designing agentic loops](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/) · [Vibe engineering](https://simonwillison.net/2025/Oct/7/vibe-engineering/)
- Mitchell Hashimoto — [Vibing a Non-Trivial Ghostty Feature](https://mitchellh.com/writing/non-trivial-vibing)
- Jesse Vincent — [blog.fsck.com](https://blog.fsck.com) (the adversarial review prompts)
- Armin Ronacher — [Agentic Coding Recommendations](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)
- Geoffrey Huntley — [the Ralph loop](https://ghuntley.com/ralph/)
- HumanLayer — [Advanced Context Engineering for Coding Agents](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md)

---

**Earlier in this series:**
- [What Actually Happens When You Talk to a Language Model](https://github.com/ishaan119/understanding_llm_model_structure) — a trace of a model's internals: tokenizer, embeddings, the 28 layers, and the files that make up a model.
- [Serving the Model: Why My First Server Was Slow, and What vLLM Actually Does](https://github.com/ishaan119/serving_llm_models) — prefill vs decode, continuous batching, PagedAttention, and a 38× measured gap.
- [MCP Demystified: How Exactly It Works](https://github.com/ishaan119/MCP_Demystefied) — JSON-RPC over stdio, the three primitives, and the discovery handshake.
