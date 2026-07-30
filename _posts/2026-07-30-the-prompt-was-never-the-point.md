---
layout: post
title: "The Prompt Was Never the Point"
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

That was the premise. Somewhere out there, I assumed, was a way of phrasing things — a magic preamble, a role-play trick, the right adjectives — that separated people shipping real work with coding agents from people fighting them. I'd been using agents daily for months. Some days felt like a superpower. Other days I'd spend forty minutes correcting an agent on a problem I could have solved in ten, and close the laptop wondering whether I'd gained anything at all.

So I did what I did with [model internals](https://github.com/ishaan119/understanding_llm_model_structure) and [model serving](https://github.com/ishaan119/serving_llm_models): I went and looked. I read the research, the practitioner write-ups, and the field reports from people running agents at scale. I rebuilt my own setup from scratch around what I found.

There was no prompt.

What the fast developers have isn't a phrasing trick. It's a **system** — a handful of components, most of which take under an hour to build, that turn a clever autocomplete into something that verifies its own work and gets better every week. The prompt is one component out of five, and it's the one with the shortest half-life.

This post is the system. Every piece is something you can build today.

The arc:

1. **The measurement problem** — why your sense of whether this is working is unreliable, and what actually predicts gains.
2. **The five components** — the anatomy of a working setup.
3. **Building it**, in the order that pays off fastest: prompts → memory → gates → workers → flywheel.
4. **The 30-day plan** and the five failure patterns that eat most people.

---

## Part 0: You Cannot Feel This Working

Before any of the tactics, one uncomfortable finding, because it changes how you should read everything after it.

In 2025, METR ran a randomized controlled trial on 16 experienced open-source maintainers working 246 real issues in their own mature repositories — averaging 22k+ stars and over a million lines of code. These were experts on their home turf.

With AI tools, they took **19% longer**.

The number that matters more is the one next to it. Before starting, they forecast they'd be 24% *faster*. Afterwards — having lived through it — they still believed they'd been **20% faster**. They were wrong about the direction, and the experience of doing the work didn't correct them.

Stanford's telemetry across roughly 100,000 developers at 600+ companies found the same gap at scale: self-assessments deviated from measured productivity by about **30 percentage points**, and only one developer in three placed themselves in the correct quartile.

Now, the honest update, because it's mid-2026 and citing a year-old study as current is exactly the sloppiness this post is arguing against. METR ran a second study from August 2025 — 57 developers, 143 repos, 800+ tasks — and it points weakly toward *speedup* rather than slowdown. But METR explicitly does not stand behind the numbers, and the reason is instructive: developers started **refusing to enroll** because they didn't want to work without AI, and 30–50% of participants **withheld tasks** they didn't want to attempt unaided. Both effects strip out exactly the cases where AI helps most, so METR frames their own result as a *lower bound*. Their read from talking to participants is that developers really are more sped up in 2026 than in 2025 — with the caveat that this is "only very weak evidence."

So the tooling has genuinely improved. Here's what did not get revised:

> The perception gap. Not one study has found that developers can accurately sense their own productivity with these tools.

That's the load-bearing finding, and it survives every revision. Which means the plan "I'll try things and keep what feels faster" is not a plan. Your feelings are the one instrument in this whole setup that is known to be broken.

### Where the gains actually are

The other thing that replicated: **context dominates**. The same tools produce opposite signs in different settings. Google's internal RCT found ~21% faster on an enterprise task. Peng et al. found 55.8% faster on a greenfield toy task. METR found 19% slower on expert brownfield work. Same technology, opposite results.

Stanford's data, after subtracting rework — which claws back a third to half of apparent gains:

| Context | Net effect |
|---|---:|
| Greenfield, low complexity | **+30–40%** |
| Brownfield, low complexity | +15–20% |
| Greenfield, high complexity | +10–15% |
| Brownfield, high complexity | **0–10%, can go negative** |

Gains fall off sharply as codebases grow from 10K to 10M lines, and in niche languages. METR's slowdown happened in precisely the worst quadrant.

**This table is a delegation guide.** Greenfield and mechanical work: hand it over, go wide, run it unattended. Complex changes in a large codebase you know intimately: stay in the loop, and expect to earn your gains through the system rather than the model.

### And it amplifies whatever you already have

DORA's 2025 report (~5,000 respondents) found the pattern that ties this together: AI **amplifies** existing organizational strengths. Teams with real tests, fast CI, small batches, and loose coupling convert agent speed into throughput. Teams without them convert it into instability — AI raises throughput and *lowers* delivery stability where the foundations are weak.

Agents don't fix a broken pipeline. They find it faster.

Which reframes the whole problem. If perception is unreliable, context determines the ceiling, and the effect is multiplicative on your existing engineering, then "get better at prompting" is the wrong goal. The goal is to build the thing being multiplied.

---

## Part 1: The Five Components

Here's the shape of what the fast developers built. Not five tricks — five parts of one machine, each covering a different failure mode.

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

Read it bottom-up and it's a hierarchy of leverage. Prompts help this afternoon and are forgotten by tomorrow. Memory helps every session forever. Gates are what let you stop reading every line. Workers multiply you. The flywheel is the only component that compounds — it's why a well-tuned setup pulls away from a generic one over months.

Most people build only the first one, hit a ceiling, and conclude the tools are overhated or overhyped depending on their mood.

There's a parallel here I keep coming back to from [the serving post](https://github.com/ishaan119/serving_llm_models). My first model server was slow, and my instinct was to make the single request faster. That was the wrong instinct — the win came from restructuring so the GPU served many requests at once. Same story here. **You don't make a single prompt better. You build the system the prompts run inside.**

---

## Act 1: Talk to It Better

Zero setup, pure craft. Four habits. You'll feel these by Friday — and per Part 0, "feel" is the operative caveat, which is why Act 3 exists.

### 1. Bake verification into every prompt

The single highest-value habit, and it's one line.

An agent stops when the work *looks* done. If there's no check it can run itself, then **you** are the verification step — every mistake sits there waiting for you to notice it. That's the loop that makes agents feel fast and measure slow: the time doesn't show up in generation, it shows up in the correction cycles afterward.

Close the loop inside the prompt. Three things, every time:

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

Concrete pass/fail cases. The command that proves it. And *"show me the output"* — evidence, not assertions. That last clause matters more than it looks: without it you get "All tests pass!" as a claim, and claims are what you're trying to eliminate.

That final line — `don't weaken the test` — is not decoration. Weakening tests to make them pass is the number one way agents cheat, and I'll come back to it in Act 3 with a CI gate that catches it.

> *"If you haven't seen it run, it's not a working system."* — Simon Willison

**Try it today:** take the next task you hand an agent and append test cases, the verify command, and "show me the output."

### 2. The four ingredients

Vague prompts don't fail loudly. They fail by costing you three correction rounds, which is exactly the cost that hides from your sense of speed.

What experts do is embed the intuition they already have as specifics. Four ingredients:

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

In my experience the missing ingredient is almost always **pattern** or **symptom**. Scope and source come naturally because they're what you'd tell a colleague. Pattern — "here's the code that already does this correctly" — is the one that turns a plausible invention into something that matches your codebase.

Exception: when you're exploring, vague is *correct*. "What would you improve about this file?" is a great prompt. Don't over-specify a question whose value is that you don't know the answer.

### 3. The two-strike rule

This one took me longest to accept, because it feels like giving up.

When you correct an agent and it fails, that failed attempt **stays in the context window** — and keeps anchoring everything after it. Correct it again, and now there are two bad attempts in there. You're no longer collaborating with a fresh mind; you're collaborating with something that has read its own wrong answers three times and is being pulled back toward them.

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

Two failed corrections on the same issue → stop. Clear the session. Re-prompt, folding in what you learned:

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

That `NOTE` is the whole technique. It's what you learned from strikes 1 and 2, **promoted from a correction into context**. First-try fix, because now it's a constraint instead of an argument.

> A clean session with a better prompt almost always beats a long session with accumulated corrections.

Same principle, different symptom: **one task, one session.** The kitchen-sink session — task A, quick side question, back to A — degrades everything in it. The side question's context doesn't disappear when you're done with it.

### 4. Plan before you build

The leverage argument is stark:

```
1 bad line of code  =  1 bug
1 bad line of plan  =  hundreds of bad lines of code
```

Which makes plan review the highest-leverage reading you will do. I can't review 2,000 lines of diff a day. I can absolutely review 200 lines of plan — and at that stage, cutting scope creep costs one keystroke instead of a refactor.

The sequence:

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

Step 3 is not optional and is not a rubber stamp. **When you edit the plan, delete at least one thing.** There is always scope creep, and it is always cheaper to remove now.

Step 4's last clause — *tell me instead of improvising* — converts a silent architectural decision into a question. That's the trade you want.

Skip all of this when the diff fits in one sentence. Planning a typo fix is ceremony, not rigor.

---

## Act 2: Teach It Your World

Act 1 helps for one session. Act 2 is where compounding starts: an hour of setup that **every future session inherits**.

### The instructions file

Every agent tool has one — `CLAUDE.md`, `AGENTS.md`, `.cursorrules`. A short file, loaded every session, holding your conventions, commands, and gotchas.

Three rules, and the third is the one people get wrong:

1. **Per line, ask: "would removing this cause a mistake?"** No → cut it.
2. **Every line is earned by an observed failure.** Nothing speculative.
3. **No "never do X" lists.** They backfire. Reframe as an incentive.

The counterintuitive part: **bloated files get ignored.** This is consistent behavior across tools — past a certain length, the model half-attends to all of it. So a 200-line instructions file is not a thorough 20-line one; it's a *worse* one, because now your three genuinely important rules are diluted by 197 lines of speculation.

The diagnostic is beautiful in its simplicity: **if the agent keeps violating a rule, your file is too long.** Not too permissive. Too long.

Here's a real one, complete, ~17 lines:

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

That last line is rule 3 in action. Not "never delete tests" — a framing of what good looks like, which is what actually steers behavior.

**Try it today:** generate a starter (most tools have an init command), then delete half of it using the pruning test.

### Skills: your workflows, on demand

> Anything you've prompted three times is a skill.

A skill is a markdown file that becomes a slash command. The key property: it's loaded **only when invoked**, so it costs zero context otherwise. That's what makes the split clean:

```
Instructions file  =  always true      (conventions)
Skills             =  sometimes needed (workflows)
```

That distinction is why you can have thirty skills and a seventeen-line instructions file, and why trying to cram workflows into the instructions file is what bloats it in the first place.

A complete, working one:

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

Then: `/fix-issue 1234`.

Notice it has Act 1 baked in — failing test first, show me the output, and an explicit boundary on what it may not do. A skill is where a good prompt goes to become permanent.

Good first skills: `fix-issue` · `tdd-cycle` · `deploy` · `review-pr` · `spike-and-report`.

One caution: **vet community skills like dependencies.** A skill is instructions executing in your repo with your permissions. No benchmarks on your task types, no trust.

### Hooks: instructions are advisory, hooks are law

Here's the distinction that upgraded my whole setup.

An agent can forget an instruction. It cannot skip a hook — because **the harness runs hooks, not the model.** There's no negotiation, no context window, no "I'll skip the lint step since the change is small."

Instructions are a note on the fridge. Hooks are the lock on the door.

So: **anything you've had to write in your instructions file twice should be a hook.** Twice means the instruction isn't working.

Good candidates:
- Lint/format after every edit
- Block commits unless tests pass
- Protect folders (migrations, generated code)

And the shortcut — don't write hook config by hand. Describe the rule in English:

```
Write a hook that runs eslint --fix on every
file you edit.

Write a hook that blocks any commit unless
`npm test` exits 0.

Write a hook that blocks edits to db/migrations/ -
I'll do those by hand.
```

It produces something like:

```json
{ "hooks": { "PostToolUse": [{
    "matcher": "Edit|Write",
    "hooks": [{ "type": "command",
      "command": "npx eslint --fix ..." }]
}] } }
```

Then **verify the hook actually fires.** A hook you haven't seen block something is a hook you don't have. (This is the same principle as "show me the output," one level up the stack.)

### Make your dev loop agent-readable

This is the least discussed and most quietly transformative item in Act 2.

**Agents debug by reading output.** If your dev server logs to a terminal the agent can't see, it is flying blind — and a blind agent guesses, which is where invented fixes come from.

Three properties of agent-friendly tooling:

- **Fast** — a 3ms check beats a 5s compile. And note the asymmetry: a crash is fine, a **hang is fatal**. A crash produces an error the agent can read; a hang produces nothing until it gives up.
- **Honest errors** — `already running (make tail-log)` beats a port-bind stack trace. A clear message is a correct next action; a stack trace is a research project.
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

Then — and this is the step people miss — **advertise it in the instructions file.** The agent cannot use what it doesn't know exists:

```markdown
- Start the app: make dev
- Read server output: make tail-log
- In debug mode, sign-in links are logged to
  stdout - use them to complete login flows
  without asking me.
```

That last line is worth the whole section. It's the difference between an agent that tests a signup flow end-to-end and one that stops to ask you for a magic link.

### Permissions that scale with trust

After the tenth approval prompt you are not reviewing. You're reflexing — clicking yes on autopilot. That is strictly worse than a curated allowlist, because it *feels* like oversight while providing none.

A three-step ladder:

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

Be clear-eyed about unattended risk. Three real failure modes: destructive commands, secret exfiltration, and your machine used as an attack proxy. The mitigation is not vigilance — vigilance is what fails at 2am. It's a **sandbox plus scoped test credentials with hard budget caps.** Structural limits, not attention.

---

## Act 3: Trust, but Verify

Acts 1 and 2 make the agent effective. Act 3 is what lets you stop reading every line — the safety net that makes letting go rational rather than reckless.

### Adversarial review: fresh eyes on every diff

Self-review fails **structurally**. When a model reviews its own work, the reasoning that produced the change is sitting right there in context, and it reads as justification. You're asking it to hold two conflicting goals at once, and models are bad at that. So are people.

A fresh context sees only the diff and the criteria. That's the entire trick, and it's nearly free.

Three levels:

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

Level 2 sounds absurd. A meaningless prize, five imaginary points. It works anyway, reliably enough that practitioners keep it in their default pipeline.

Level 3 has the best hit rate in my experience, and it makes sense: a different provider's model has different blind spots. Jesse Vincent has documented cross-model review catching real P1 bugs in production open source.

The one rule: **always scope the reviewer.** "Review this code" gets you an unbounded list of stylistic opinions, and then you over-engineer chasing findings that were never problems. `Report only issues affecting correctness` is doing real work in those prompts.

### Custom specialists: a reviewer in five lines

Most agent tools let you define sub-agents — a small file becomes a reusable specialist with its own tools, model tier, and **isolated context**.

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

Two fields carry all the design weight. **`tools` is the safety lever** — a reviewer that can't edit can't "helpfully" fix what it finds and hand you a diff you didn't ask for. **`model` is the cost lever** — the researcher reading twenty files to summarize them doesn't need your best model; the security reviewer does.

`test-writer` having no write access to source is the same idea as the deny-list: make the wrong action impossible rather than discouraged.

### Visual verification: give it eyes

For UI work, the check isn't a test suite. It's your eyes — which means it's a human bottleneck on every iteration.

So give the agent eyes. Browser automation can screenshot, compare against a design, and iterate:

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

The loop is: implement → screenshot → compare → list differences → fix → re-screenshot. **You walk away; it converges.** That "list every visual difference" step is what makes it work — it forces an explicit comparison instead of a vibe check, which is the same move as "show me the output."

Works well for new components, responsive breakpoints, dark mode, and design compliance. In my setup this is the *one* browser-automation integration worth wiring up. Everything else stays CLI, because CLI output is text an agent can read.

### CI gates tuned for agent-generated code

Here's the finding that should reshape your pipeline. **Agent code fails differently from human code.**

Apiiro's Fortune 50 telemetry, comparing AI-assisted output to the baseline:

| Failure type | Change |
|---|---:|
| Syntax errors | **−76%** |
| Logic bugs | **−60%** |
| Privilege-escalation paths | **+322%** |
| Architectural flaws | **+153%** |

The shallow stuff went away. The deep stuff got substantially worse. And that mix is *precisely inverted* from what code review catches well — reviewers reliably spot a typo and reliably skim past a subtly broken authorization path in a 900-line PR.

Add Veracode's result across 100+ models: **45% of AI-generated code failed security tests**, and security performance stayed **flat regardless of model size or recency**, even as functional correctness improved steadily. The next model will write better code. It will not write more secure code. Waiting for the model to save you is not a strategy.

And GitClear, over 211 million changed lines (2020–2024): code churn — rewritten within two weeks — nearly doubled; copy-pasted code up 48%; **moved/refactored lines collapsed from 24.1% to 9.5%**. Agents add. They don't consolidate.

Three gates that catch specifically these things:

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

- **Coverage ratchet** — catches the #1 agent cheat: weakening tests to make them pass.
- **Secret scan + SAST** — because security is flat across models.
- **Duplication check** — the direct counter to the refactoring collapse.

Then the step that makes it real:

```
Open a draft PR that deletes one test.
Show me the pipeline failing.
```

> A gate you haven't seen fail is a gate you don't have.

---

## Act 4: Let Go

Now the payoff. With Acts 1–3 in place, you can run work you aren't watching.

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

Ground rules from the field, all four earned the hard way:

- **3–4 workstreams max.** Your review bandwidth saturates long before compute does. This is the real constraint and it's human.
- **Clean baseline first** — install, lint, test green. Debugging a broken baseline across three worktrees is genuinely awful.
- **Watch shared state outside the repo** — database, Redis, ports. Worktrees isolate files, not your dev database.
- **Never two agents in one file.**

Worth noting the contrarian datapoint: Mitchell Hashimoto deliberately runs **one** agent, active maybe 10–20% of his day, and ships significant features. More parallelism is not automatically more output. It's more output only if your review capacity absorbs it.

### Headless fan-out for migrations

For the 200-file mechanical migration — the chore you've deferred for a year — one scripted agent call per file:

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

`Reply only OK or FAIL: reason` is the design decision that makes this work. It turns every invocation into a **parseable unit of work**, so 200 files becomes one grep instead of 200 diffs to read.

Don't skip the pilot. Three files, read the diffs properly, refine the prompt. A bad prompt at scale is 200 bad commits.

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

Why does something this dumb work? **Backpressure.** The compiler and the test suite reject bad iterations automatically. That rejection *is* the steering — no human in the loop, but not an unconstrained one either. It's Act 1's "close the loop" principle taken to its limit: the verification step has become the only supervision.

Field results are real: an overnight hackathon shipping six repos; a ~$50k-contract MVP for roughly $297 in tokens.

Scope it honestly, though — and Huntley, who invented it, is the most honest of anyone here. It gets **greenfield bootstrapping to about 90%**. He wouldn't run it on an existing codebase, and calls claims of 100% engineer-free work "horseshit."

Two failure modes to know: **doing too much at once**, and **premature victory** — a later session sees partial progress and declares the job done. The fixes are structural: one feature per session, every session ending in a mergeable state, and a "bearings ritual" at session start (`pwd`, git log, read the progress file, run an end-to-end smoke test *before* writing new code).

⚠️ **Container or sandbox only.** This runs unattended with permissions off. Watch the first ten iterations before you trust it. Expect some broken mornings — `git reset --hard` is a legitimate tool here.

### The end-of-day agent

The cheapest continuous win in this entire post. Spend the last fifteen minutes launching work that runs overnight.

**Not shipping. Reporting.**

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

The safety rule, and it's the one that makes this comfortable rather than nerve-wracking:

> **Overnight agents write to files. Humans ship.**

Nothing pushes, nothing comments publicly, nothing merges. The worst case is a wasted night and a file you delete. Then you get a **warm start**: read the report with coffee, decide, direct. You begin the day with analysis instead of a blank page.

---

## The Flywheel: The Only Part That Compounds

Everything above is a snapshot. This is the part that makes next month better than this one.

### Capture what it invented

The agent just solved something hard. Along the way it improvised techniques that are *not* in your instructions file — a debugging approach, a non-obvious constraint about your codebase, a sequence that worked after three that didn't.

Clear the session and all of that is gone. One prompt keeps it:

```
Write a short report of the non-obvious techniques
you used in this session - things a future agent
(or future me) wouldn't know to try. Format as
bullets I can paste into the instructions file.
```

Then promote the useful ones into the instructions file or a skill. That's the loop:

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

Two more prompts in the same family:

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

That last one is the flywheel eating its own errors — turning failures into structure automatically. It's how one well-tuned agent outperforms a fleet of generic ones.

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

Four numbers, monthly:

- **2-week churn** — % of new code rewritten within 14 days (GitClear's key signal, and it nearly doubled industry-wide)
- **Rework share** — fix/revert commits as % of total
- **Coverage trend** — is the ratchet holding?
- **Incidents** traced to agent-written changes

**Capture the baseline now**, before you build anything else. You cannot measure improvement without a "before" photo, and this is the one step that's impossible to do retroactively.

### The monthly prune: systems must shrink too

A system that only grows eventually ignores itself.

This is the ritual most people skip, and it's the one that keeps everything else working. An instructions file that's too long gets half-ignored — so **every stale line you keep is actively degrading the lines that matter.** Additions have a cost, and it's paid by your good rules.

The monthly pass:

- Per line: *"does the agent still make this mistake without it?"* No → delete.
- Skills uninvoked in 30 days → delete.
- Hooks that never fire → audit (a hook that never fires is either dead or your rule was speculative).
- Workarounds for bugs that got fixed → gone.

```
Review my instructions file. For each line, assess:
- Does the current model still need this?
- Is the rule still true? (APIs change)
- Is there a shorter way to say it?
Flag lines that are safe to remove.
I'll make the final call.
```

Note *"I'll make the final call."* Pruning is a judgment call about your own codebase — get the analysis from the agent, keep the decision.

One force that makes this mandatory rather than nice-to-have: **newer models need fewer rules.** A file tuned for last year's model is over-constrained today. Half of what you wrote was compensating for a weakness that no longer exists — and it's still there, burning attention.

**Try it today:** open your instructions file and delete the bottom third — the stuff you added speculatively and never verified.

---

## The 30-Day Build

The order matters. Each week's payoff funds the next.

| Week | Theme | Build | Cost |
|---|---|---|---|
| **1** | Talk | Verification in every prompt · four ingredients · two-strike rule · plan before build | Zero setup |
| **2** | Teach | Instructions file (prune hard) · first skill · first hooks · agent-readable logs · permission ladder | ~1 hour |
| **3** | Verify | Adversarial review pre-merge · custom specialists · visual verification · CI gates | The safety net |
| **4** | Let go | Worktrees · one autonomous loop · end-of-day agent · scorecard vs. baseline · flywheel + prune | The system runs |

Two notes. **Run the scorecard in week 1**, not week 4 — you want the "before" photo before you change anything. And calibrate: new to agents? Week 1 alone is enough, genuinely. Leading a team? Weeks 3–4 are your leverage, because gates and measurement are the parts individuals won't build for themselves.

---

## Five Failure Patterns

Recognize these early. Each one has a fix above.

**1. The kitchen-sink session.** Task A, side question, back to A. Context full of noise. → One task, one session.

**2. Correcting over and over.** Strike three, four, five. The context is poisoned and you're arguing with the agent's own bad attempts. → Two-strike rule.

**3. The bloated instructions file.** So long the agent ignores the rules you actually care about. → Monthly prune. The tell: it keeps violating a rule you wrote down.

**4. The trust-then-verify gap.** Plausible-looking code, unhandled edge cases. Reads fine, breaks in production — and remember, this is the failure mode that got *worse*, not better. → Verification in every prompt + adversarial review.

**5. Shipping what you don't understand.** The agent solved it; you can't explain it. → Back it out, or make it teach you. Non-negotiable, because **you are the DRI.** When it pages at 3am, "the agent wrote it" is not a diagnosis.

---

## What I Actually Understand Now

Before I looked into any of this, if you'd asked me how to get more out of a coding agent I'd have said "write better prompts." Technically true. Not useful — and it quietly frames the whole thing as a communication problem, which sends you off collecting phrasing tricks.

Here's what I'd say now.

A coding agent is a component, not a colleague. It generates plausible work quickly and has no idea whether that work is correct. Everything that determines your actual output is the machinery you put *around* it: verification it can run without you, memory so it doesn't relearn your world every morning, gates that catch the specific things it gets wrong, isolation so it can run in parallel without stepping on itself, and a capture loop so what it figures out today is still there next month.

The prompt is the smallest part. It's also the only part most people build, which is why the results are so bimodal — same tools, wildly different outcomes, and a perception gap wide enough that neither camp can tell which one they're in.

Three things I'd underline for anyone starting:

**The failure mode inverted, and nobody updated their review process.** Fewer typos, far more privilege-escalation paths and architectural flaws. Human review is well-calibrated for the old distribution and badly calibrated for the new one. That gap is what CI gates are for — it isn't a thing you can be more careful about.

**Structure beats vigilance, every time.** Instructions get forgotten; hooks execute. Approval prompts become reflexes; allowlists and sandboxes hold. Careful attention degrades at 2am and after the tenth prompt — a `deny` rule does not. Every durable improvement in my setup was a case of converting an intention into a mechanism.

**And the compounding is the whole game.** Better prompts help this afternoon. An instructions file helps every session forever. A flywheel makes next month better than this month without your involvement. Those aren't three sizes of the same win, they're three different kinds — and only the last one pulls away over time.

The measurements are what convinced me, same as with [serving](https://github.com/ishaan119/serving_llm_models). There, the model didn't get smarter — 38× more throughput came from getting the serving out of its own way. Here, the model doesn't get smarter either. You just stop being the bottleneck in your own loop.

> Your job is no longer to write code. It's to build a system that writes correct code.

Start with verification on your very next prompt. It costs nothing, and it's the one habit every other component is downstream of.

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
