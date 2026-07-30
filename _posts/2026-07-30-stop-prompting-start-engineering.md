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
  in under an hour. Here it is, with the research behind each piece.
---

I went looking for the prompt.

That was the premise: somewhere out there was a way of phrasing things — a magic preamble, a role-play trick, the right adjectives — that separated people shipping real work with coding agents from people fighting them. I'd been using agents daily for months. Some days felt like a superpower. Other days I'd spend forty minutes correcting an agent on a problem I could have solved in ten.

So I did what I did with [model internals](https://github.com/ishaan119/understanding_llm_model_structure) and [model serving](https://github.com/ishaan119/serving_llm_models): I read the research, the practitioner write-ups, and the field reports from people running agents at scale, then rebuilt my setup around what I found.

There was no prompt.

What the fast developers have is a **system** — five components, most buildable in under an hour, that turn a clever autocomplete into something that verifies its own work. The prompt is one of the five, and it's the one with the shortest half-life.

---

## Part 0: You Cannot Feel This Working

One uncomfortable finding first, because it changes how you should read everything after it.

In 2025, METR ran a randomized controlled trial on 16 experienced open-source maintainers working 246 real issues in their own mature repositories — 22k+ stars, over a million lines. Experts on home turf.

With AI tools, they took **19% longer**.

The number that matters more sits next to it. They forecast they'd be 24% *faster*. Afterwards, having lived through it, they still believed they'd been **20% faster**. Stanford's telemetry across ~100,000 developers at 600+ companies found the same gap at scale: self-assessments deviated from measured productivity by about **30 percentage points**.

The honest update, because it's mid-2026 and citing a year-old study as current is the sloppiness this post argues against: METR's second study (57 developers, 143 repos, 800+ tasks) points weakly toward *speedup*. But they don't stand behind the numbers, and the reason is instructive — developers began refusing to enroll, and 30–50% withheld tasks they didn't want to attempt unaided. Both effects strip out exactly the cases where AI helps most, so METR frames the result as a lower bound.

So the tooling improved. Here's what didn't get revised:

> The perception gap. No study has found that developers can accurately sense their own productivity with these tools.

Which means "I'll try things and keep what feels faster" is not a plan. Your feelings are the one instrument here that's known to be broken.

### Where the gains actually are

The other thing that replicated: **context dominates**. Google's internal RCT found ~21% faster on an enterprise task. Peng et al. found 55.8% faster on a greenfield toy task. METR found 19% slower on expert brownfield work. Same technology, opposite signs.

Stanford's data, after subtracting rework — which claws back a third to half of apparent gains:

| Context | Net effect |
|---|---:|
| Greenfield, low complexity | **+30–40%** |
| Brownfield, low complexity | +15–20% |
| Greenfield, high complexity | +10–15% |
| Brownfield, high complexity | **0–10%, can go negative** |

**This table is a delegation guide.** Greenfield and mechanical work: hand it over, run it unattended. Complex changes in a large codebase you know intimately: stay in the loop.

DORA's 2025 report (~5,000 respondents) ties it together: AI **amplifies** existing organizational strengths. Teams with real tests, fast CI, and small batches convert agent speed into throughput. Teams without them convert it into instability.

Agents don't fix a broken pipeline. They find it faster.

---

## Part 1: The Five Components

```
                  ┌─────────────────────────────────────┐
                  │              YOU                    │
                  │   specs, judgment, direction        │
                  └──────────────┬──────────────────────┘
                                 │
        ┌────────────────────────▼─────────────────────────┐
        │  PROMPTS    how you ask                          │  Act 1  (free)
        │             scope · source · pattern · symptom   │
        ├──────────────────────────────────────────────────┤
        │  MEMORY     what it knows without being told     │  Act 2  (~1 hr)
        │             instructions · skills · hooks        │
        ├──────────────────────────────────────────────────┤
        │  GATES      what catches mistakes, not you       │  Act 3
        │             fresh-eyes review · CI · specialists │
        ├──────────────────────────────────────────────────┤
        │  WORKERS    parallelism that scales you          │  Act 4
        │             worktrees · fan-out · overnight runs │
        ├──────────────────────────────────────────────────┤
        │  FLYWHEEL   how the system improves itself       │  Act 4
        │             capture tricks · measure · prune     │
        └──────────────────────────────────────────────────┘
```

It's a hierarchy of leverage. Prompts help this afternoon. Memory helps every session forever. Gates are what let you stop reading every line. Workers multiply you. The flywheel is the only component that compounds.

Most people build only the first one, hit a ceiling, and conclude the tools are overhyped or overhated depending on their mood.

My first model server was slow, and my instinct was to make the single request faster. Wrong instinct — the win came from restructuring so the GPU served many requests at once. Same here. **You don't make a single prompt better. You build the system the prompts run inside.**

---

## Act 1: Talk to It Better

Zero setup, pure craft. Four habits.

### 1. Bake verification into every prompt

An agent stops when the work *looks* done. If there's no check it can run itself, then **you** are the verification step — and that's the loop that makes agents feel fast and measure slow. The time doesn't show up in generation; it shows up in the correction cycles.

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

`don't weaken the test` isn't decoration. Weakening tests to make them pass is the number one way agents cheat; Act 3 has a CI gate for it.

> *"If you haven't seen it run, it's not a working system."* — Simon Willison

### 2. The four ingredients

Vague prompts don't fail loudly. They cost you three correction rounds — exactly the cost that hides from your sense of speed. Embed the intuition you already have as specifics:

- **Scope** — which file, which scenario
- **Source** — where the answer lives ("check the git history of X")
- **Pattern** — an existing example to imitate
- **Symptom** — what you observed, and what "fixed" looks like

```
# BEFORE
fix the login bug

# AFTER (scope + source + pattern + symptom)
Users report login fails after session timeout.
Check the auth flow in src/auth/, especially
token refresh.
Look at how src/api/client.ts handles token
refresh - follow that pattern.
Write a failing test that reproduces it FIRST,
then fix, then run the suite.
```

The missing ingredient is almost always **pattern** or **symptom**. Scope and source come naturally because they're what you'd tell a colleague. Pattern — "here's the code that already does this correctly" — is what turns a plausible invention into something that matches your codebase.

When you're exploring, vague is *correct*. "What would you improve about this file?" is a great prompt.

### 3. The two-strike rule

When you correct an agent and it fails, that failed attempt **stays in the context window**, anchoring everything after it. Correct it again and there are two bad attempts in there. You're collaborating with something that has read its own wrong answers three times.

```
   context quality
        │
   good ●────────────╮
        │             ╰──● strike 1: one bad attempt in context
        │                  ╰────● strike 2: it's anchoring now
        │                        ╰──────● strike 3+: poisoned
    bad │
        └──────────────────────────────────────▶ corrections

        ┌─ CLEAR HERE ─┐
        │  and re-prompt with what you learned
        └──────────────┘
```

Two failed corrections on the same issue → clear the session, re-prompt, fold in what you learned:

```
# strike 1: correct it
# strike 2: correct it again
# then: CLEAR THE SESSION and re-prompt:

Refactor the session store to Redis.
NOTE: the naive approach fails because
middleware reads the session before hydration -
handle init order explicitly.
Put the Redis client init in a factory that
middleware and routes both import.
```

That `NOTE` is the technique: what you learned from strikes 1 and 2, promoted from a correction into context. First-try fix, because now it's a constraint instead of an argument.

Same principle, different symptom: **one task, one session.** The side question's context doesn't disappear when you're done with it.

### 4. Plan before you build

```
1 bad line of code  =  1 bug
1 bad line of plan  =  hundreds of bad lines of code
```

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

## Act 2: Teach It Your World

Act 1 helps for one session. Act 2 is an hour of setup that **every future session inherits**.

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

That last line is rule 3 in action — a framing of what good looks like, which is what actually steers behavior.

### Skills: your workflows, on demand

> Anything you've prompted three times is a skill.

A skill is a markdown file that becomes a slash command, loaded **only when invoked** — so it costs zero context otherwise.

```
Instructions file  =  always true      (conventions)
Skills             =  sometimes needed (workflows)
```

That's why you can have thirty skills and a seventeen-line instructions file.

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

Then `/fix-issue 1234`. Note it has Act 1 baked in — failing test first, show me the output, explicit boundaries. A skill is where a good prompt goes to become permanent.

Good first skills: `fix-issue` · `tdd-cycle` · `deploy` · `review-pr` · `spike-and-report`.

One caution: **vet community skills like dependencies.** A skill is instructions executing in your repo with your permissions.

### Hooks: instructions are advisory, hooks are law

An agent can forget an instruction. It cannot skip a hook, because **the harness runs hooks, not the model.** No negotiation, no context window, no "I'll skip the lint step since the change is small."

Instructions are a note on the fridge. Hooks are the lock on the door.

So **anything you've had to write in your instructions file twice should be a hook.** Twice means the instruction isn't working. Good candidates: lint/format after every edit, block commits unless tests pass, protect folders like migrations.

Don't write hook config by hand — describe the rule in English:

```
Write a hook that runs eslint --fix on every
file you edit.

Write a hook that blocks any commit unless
`npm test` exits 0.

Write a hook that blocks edits to db/migrations/ -
I'll do those by hand.
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

Then **advertise it in the instructions file** — the agent can't use what it doesn't know exists:

```markdown
- Start the app: make dev
- Read server output: make tail-log
- In debug mode, sign-in links are logged to
  stdout - use them to complete login flows
  without asking me.
```

That last line is the difference between an agent that tests a signup flow end-to-end and one that stops to ask you for a magic link.

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

## Act 3: Trust, but Verify

Acts 1 and 2 make the agent effective. Act 3 is what lets you stop reading every line.

### Adversarial review: fresh eyes on every diff

Self-review fails **structurally**. When a model reviews its own work, the reasoning that produced the change is sitting in context, and it reads as justification. A fresh context sees only the diff and the criteria.

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

Level 2 sounds absurd — a meaningless prize, five imaginary points. It works anyway. Level 3 has the best hit rate in my experience: a different provider's model has different blind spots. Jesse Vincent has documented cross-model review catching real P1 bugs in production open source.

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

Two fields carry the design weight. **`tools` is the safety lever** — a reviewer that can't edit can't "helpfully" fix what it finds. **`model` is the cost lever** — the researcher summarizing twenty files doesn't need your best model; the security reviewer does.

### Visual verification: give it eyes

For UI work the check is your eyes, which makes it a human bottleneck on every iteration. So give the agent eyes:

```
Implement the card component from this design:
[attach design screenshot]
Then:
1. Start the dev server (make dev)
2. Screenshot localhost:3000/cards
3. Compare to the reference design
4. List every visual difference
5. Fix each one; re-screenshot after
6. Stop when they match
```

**You walk away; it converges.** "List every visual difference" is what makes it work — it forces an explicit comparison instead of a vibe check. This is the one browser-automation integration worth wiring up; everything else stays CLI, because CLI output is text an agent can read.

### CI gates tuned for agent-generated code

**Agent code fails differently from human code.** Apiiro's Fortune 50 telemetry, against baseline:

| Failure type | Change |
|---|---:|
| Syntax errors | **−76%** |
| Logic bugs | **−60%** |
| Privilege-escalation paths | **+322%** |
| Architectural flaws | **+153%** |

The shallow stuff went away; the deep stuff got substantially worse. That mix is *precisely inverted* from what code review catches well — reviewers reliably spot a typo and reliably skim past a subtly broken authorization path in a 900-line PR.

Veracode, across 100+ models: **45% of AI-generated code failed security tests**, and security performance stayed **flat regardless of model size or recency** even as functional correctness improved. The next model will write better code. It will not write more secure code.

GitClear, over 211 million changed lines (2020–2024): code churn nearly doubled, copy-pasted code up 48%, and **moved/refactored lines collapsed from 24.1% to 9.5%**. Agents add. They don't consolidate.

```
# Use the agent to build its own gates:

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
- **Secret scan + SAST** — because security is flat across models.
- **Duplication check** — the direct counter to the refactoring collapse.

Then make it real:

```
Open a draft PR that deletes one test.
Show me the pipeline failing.
```

> A gate you haven't seen fail is a gate you don't have.

---

## Act 4: Let Go

### Parallel worktrees

One git worktree per task = isolated checkouts. Review task one while task two runs.

```bash
$ git worktree add ../app-oauth -b oauth
$ git worktree add ../app-perf  -b perf

# Terminal 1
$ cd ../app-oauth && npm ci && <start your agent>

# Terminal 2 - simultaneously
$ cd ../app-perf && npm ci && <start your agent>

# Cleanup when merged
$ git worktree remove ../app-oauth
```

Ground rules, all earned the hard way:

- **3–4 workstreams max.** Your review bandwidth saturates long before compute does.
- **Clean baseline first** — install, lint, test green.
- **Watch shared state outside the repo** — database, Redis, ports. Worktrees isolate files, not your dev database.
- **Never two agents in one file.**

The contrarian datapoint: Mitchell Hashimoto deliberately runs **one** agent, active maybe 10–20% of his day, and ships significant features. More parallelism is only more output if your review capacity absorbs it.

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

```markdown
# PROMPT.md - the agent's entire brain
Study SPEC.md and fix_plan.md.
Pick the SINGLE most important unfinished task
and implement it.
Rules:
- Search before assuming something's missing
- No stubs or placeholders - real code only
- Run build + tests; fix ALL failures first
- Update fix_plan.md, commit, then stop
```

Why does something this dumb work? **Backpressure.** The compiler and test suite reject bad iterations automatically, and that rejection *is* the steering. It's Act 1's "close the loop" taken to its limit.

Field results are real: an overnight hackathon shipping six repos; a ~$50k-contract MVP for roughly $297 in tokens.

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

Or explore in parallel:

```
Try three approaches to caching the report query:
materialized view, Redis, request-level memo.
Prototype each on a branch, benchmark, write a
comparison to docs/spikes/report-caching.md
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

```
     ┌──────────────────────────────────────┐
     │                                      │
     ▼                                      │
  agent works                               │
     │                                      │
     ▼                                      │
  learns a trick ──▶ you capture it ──▶ future sessions
     │                start smarter          ▲
     │                     │                 │
     │                     ▼                 │
     │            they hit harder problems ──┘
     └──────────────▶ new tricks
```

Two more in the same family:

```
# After a clever workaround:
That approach to [X] was clever. Write it up as a
reusable skill with a concrete example, so future
sessions can use it without rediscovering it.

# Monthly - mine your failures:
Read the last 20 CI failure logs. What are the 3
most common agent mistakes? For each, propose an
instructions-file line or a hook that prevents it.
```

That last one is the flywheel eating its own errors. It's how one well-tuned agent outperforms a fleet of generic ones.

### The scorecard: your gut is not a metric

Back to Part 0. Perception is broken, so instrument.

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

**Capture the baseline now**, before you build anything else. This is the one step that's impossible to do retroactively.

### The monthly prune: systems must shrink too

A system that only grows eventually ignores itself. An instructions file that's too long gets half-ignored, so **every stale line you keep degrades the lines that matter.**

- Per line: *"does the agent still make this mistake without it?"* No → delete.
- Skills uninvoked in 30 days → delete.
- Hooks that never fire → audit.
- Workarounds for bugs that got fixed → gone.

```
Review my instructions file. For each line, assess:
- Does the current model still need this?
- Is the rule still true? (APIs change)
- Is there a shorter way to say it?
Flag lines that are safe to remove.
I'll make the final call.
```

One force makes this mandatory rather than nice-to-have: **newer models need fewer rules.** A file tuned for last year's model is over-constrained today, and half of what you wrote was compensating for a weakness that no longer exists.

---

## The 30-Day Build

| Week | Theme | Build | Cost |
|---|---|---|---|
| **1** | Talk | Verification in every prompt · four ingredients · two-strike rule · plan before build | Zero setup |
| **2** | Teach | Instructions file (prune hard) · first skill · first hooks · agent-readable logs · permission ladder | ~1 hour |
| **3** | Verify | Adversarial review pre-merge · custom specialists · visual verification · CI gates | The safety net |
| **4** | Let go | Worktrees · one autonomous loop · end-of-day agent · scorecard vs. baseline · flywheel + prune | The system runs |

**Run the scorecard in week 1**, not week 4 — you want the "before" photo before you change anything. New to agents? Week 1 alone is enough. Leading a team? Weeks 3–4 are your leverage, because gates and measurement are the parts individuals won't build for themselves.

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

**The failure mode inverted, and nobody updated their review process.** Fewer typos, far more privilege-escalation paths and architectural flaws. Human review is well-calibrated for the old distribution and badly calibrated for the new one. That gap is what CI gates are for — it isn't something you can be more careful about.

**Structure beats vigilance.** Instructions get forgotten; hooks execute. Approval prompts become reflexes; allowlists and sandboxes hold. Every durable improvement in my setup was converting an intention into a mechanism.

**The compounding is the whole game.** Better prompts help this afternoon. An instructions file helps every session forever. A flywheel makes next month better without your involvement.

The measurements are what convinced me, same as with [serving](https://github.com/ishaan119/serving_llm_models). There, the model didn't get smarter — 38× more throughput came from getting the serving out of its own way. Here, the model doesn't get smarter either. You just stop being the bottleneck in your own loop.

> Your job is no longer to write code. It's to build a system that writes correct code.

Start with verification on your very next prompt. It costs nothing, and every other component is downstream of it.

---

## Go Deeper

**Guides worth your weekend**
- [Claude Code best practices](https://code.claude.com/docs)
- Simon Willison — [Designing agentic loops](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/) · [Vibe engineering](https://simonwillison.net/2025/Oct/7/vibe-engineering/)
- Mitchell Hashimoto — [Vibing a Non-Trivial Ghostty Feature](https://mitchellh.com/writing/non-trivial-vibing)
- Jesse Vincent — [blog.fsck.com](https://blog.fsck.com) (the adversarial review prompts)
- Armin Ronacher — [Agentic Coding Recommendations](https://lucumr.pocoo.org/2025/6/12/agentic-coding/)
- Geoffrey Huntley — [the Ralph loop](https://ghuntley.com/ralph/)
- HumanLayer — [Advanced Context Engineering for Coding Agents](https://github.com/humanlayer/advanced-context-engineering-for-coding-agents/blob/main/ace-fca.md)

**The evidence** (for when someone asks "says who?")
- [METR RCT](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/) · [2026 follow-up](https://metr.org/blog/2026-02-24-uplift-update/) — the perception gap, and an honest re-examination
- [DORA 2025](https://dora.dev/research/2025/dora-report/) — the amplifier thesis
- [Stanford SE Productivity Lab](https://softwareengineeringproductivity.stanford.edu/) — gains by task complexity and codebase maturity
- [GitClear](https://www.gitclear.com/ai_assistant_code_quality_2025_research) — churn, duplication, the refactoring collapse
- [Veracode 2025 GenAI Code Security Report](https://www.veracode.com/resources/analyst-reports/2025-genai-code-security-report/) · Apiiro Fortune 50 telemetry — the failure-mode shift

---

**Earlier in this series:**
- [What Actually Happens When You Talk to a Language Model](https://github.com/ishaan119/understanding_llm_model_structure) — a trace of a model's internals: tokenizer, embeddings, the 28 layers, and the files that make up a model.
- [Serving the Model: Why My First Server Was Slow, and What vLLM Actually Does](https://github.com/ishaan119/serving_llm_models) — prefill vs decode, continuous batching, PagedAttention, and a 38× measured gap.
- [MCP Demystified: How Exactly It Works](https://github.com/ishaan119/MCP_Demystefied) — JSON-RPC over stdio, the three primitives, and the discovery handshake.
