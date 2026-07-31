---
title: "The Founding Engineer's Playbook"
subtitle: "The engineering practices I wish someone had handed me on day one"
series: "Engineering Practice"
date: 2024-09-27
hero_image: https://github.com/user-attachments/assets/c2bdf5e3-b406-48ff-b22f-ef6b52d69e9b
hero_alt: "The Founding Engineer's Playbook"
source_repo: https://github.com/ishaan119/FoundingEngineersPlaybook
description: >-
  Code review, git hooks, release workflows, CI/CD, monitoring, and the security
  basics you can't skip. Not a comprehensive list — just enough to let a small
  team push code with confidence and ship faster.
---

This one is personal. It's the thing I wish someone had handed me when I became the first engineer at a startup.

It's not a comprehensive list. It's just enough to get you started — enough that you and your team can push code with confidence and ship faster. In my experience even startups with good traction and seed funding would benefit from most of it. Use it as a guide and adapt the recommendations to your context.

The short version:

- **Implement code reviews early** — for quality, and for knowledge sharing.
- **Use git hooks.** Best ROI of anything here.
- **Pick a release workflow** that matches your team size, and actually implement it.
- **Set up CI/CD early.** It only gets harder to retrofit.
- **Get monitoring and error tracking in place** before a firefighting culture sets in.
- **Don't skip the security basics**, even at five people.

---

## Code Review

*Boy Scout Rule: leave the code better than you found it.*

> Agree on style guides and **automate** them. Set a clear process for reviewers and PR structure. Keep PRs **small** (<200 lines). PRs shouldn't sit open for days — respond **fast**. Document important decisions somewhere other than PR comments. Stay humble: focus on merging, not ownership.

Code reviews usually become necessary when teams grow, and psychologically I've always found code quality is better when you know someone is going to look at your work. If you're a couple of senior engineers you might not need a formal process, but it's still worth establishing early.

If you're the only engineer, skip it — but be aware that some form of review adds a lot of value. Pair programming and automated testing both count.

> **Opinion:** it's hard to hire senior engineers at early-stage startups, and most of the time you end up with junior devs. Code reviews or pair programming are a great way to help them improve.

Reviews aren't just for catching bugs. They spread practices and experience across the team, and catching a bug in review is dramatically cheaper than catching it in production.

But beware: code reviews also surface poor culture and unprofessional behaviour. Without proper management they slow things down and hurt morale.

And being a good developer doesn't make you a good reviewer. Great reviewers know how to give constructive feedback, respond well to comments, and — most importantly — know what to ignore and where to push.

### Setting up code reviews

Agree on the fundamentals first, and automate what you can.

| Aspect | Description |
|---|---|
| **Style guides** | Every language has them and they save time. Don't debate styling in reviews — it takes focus away from catching bugs. Agree on one and automate it. |
| **Process** | Define who reviews and how many reviewers you need. Usually the people who wrote the original code, or who have the business context. |
| **PR size and timelines** | Set rules — under 200 lines, open less than 24 hours. |
| **PR format** | Define commit message structure, including identifiers like bug IDs. |
| **Document decisions** | Don't let key decisions live in PR comments; nobody reads those later. Update the design doc or the code. |
| **Right attitude** | Don't just critique — give sincere praise too. Review promptly. When someone acts on feedback, acknowledge it and move on. |
| **Atomic commits** | Keep changes small and logical. Don't fix everything in one PR. |
| **Disagreements** | Set up an escalation path, because disagreements will happen. Resolve them fast — lingering conflict costs velocity and morale. |

---

## Git Hooks

*Automation doesn't just catch mistakes — it eliminates the awkwardness of a human having to point them out.*

Git hooks deserve their own chapter. Adding them early is probably the best ROI you'll get, and there are plenty of pre-written ones you can drop straight into your workflow.

| Hook | Purpose |
|---|---|
| **Linting** | Enforce coding standards across the team. |
| **File checks** | Make sure no unnecessary files get committed. |
| **Commit message formatting** | Keep commit messages consistent. |
| **Static analysis** | Catch bugs before they enter the codebase. |

The beauty of hooks is their flexibility. As long as the script is executable, git doesn't care what language it's in — bash, Python, anything.

Even on an existing project you can start using hooks immediately without touching current code. It's a seamless addition, and I'd start as early as possible.

Which hook to use depends on where you want the check to happen: `pre-commit` for anything the developer should fix before the commit lands, `pre-receive` to enforce standards before a commit is accepted at all, and the `post-` variants for notifications or triggering a deploy.

> ⚠️ Hooks are there to help developers and encourage defensive programming — but developers *can* disable them if they choose to (hopefully they won't). Running equivalent checks on GitHub requires a paid service.

For a collection of useful ones, see [githooks.com](https://githooks.com/).

---

## Code Release Management

*The balancing act between order and chaos — because no process is perfect, but skipping one guarantees chaos.*

This is something I've seen most startups struggle with. Either you've got a hugely complicated process copied from an established company, or something so basic it eventually throttles the team.

We'll assume you're using git. If not, you'd better have a solid reason.

### Trunk-based development

One of the most popular workflows for fast-moving teams.

1. Single branch (`main`)
2. Commit directly to `main`, using very short-lived branches (under 24 hours)
3. `main` is always production-ready and deployed after every commit

<img width="718" alt="Trunk-based development" src="https://github.com/user-attachments/assets/b9eb8825-578e-44e7-95b6-566adc4f2981">

For this to work you need a solid CI/CD pipeline with real unit and integration testing. **Feature flags** are essential too. It's a developer's dream for a fast-moving team, but there are trade-offs — it's best for smaller teams (under 10 engineers) with strong CI/CD. If you have compliance needs, or a QA team that doesn't release frequently, it's probably not the fit.

### Git flow

One of the best-known workflows in the industry.

1. Suited to teams with fixed release cycles
2. Multiple long-lived branches, typically `main` and `develop`
3. Additional branches for features, releases, and hotfixes

<img width="1053" alt="Git flow" src="https://github.com/user-attachments/assets/bea6321f-30d2-4ab7-bd27-8945582730f8">

This excels where you have specific testing needs, compliance requirements, or a larger team. It gives clear traceability for features, testing status, and live releases. Great for staggered production releases and accountability — just protect your branches and clean up old ones.

### Feature branching

Aims to combine the best of both.

1. Single long-lived `main` branch
2. Short-lived feature branches for concurrent development
3. `main` stays production-ready, thanks to a strong CI/CD pipeline

<img width="767" alt="Feature branching" src="https://github.com/user-attachments/assets/c60a4e34-8d4b-4637-a6de-6cfe9b2e0797">

### The trade-offs

| Workflow | Pros | Cons |
|---|---|---|
| **Trunk-based** | Simple · codebase always production-ready · fewer merge conflicts | Requires robust CI/CD · leans on senior engineers · feature flag clutter · limited traceability |
| **Git flow** | Suits staged releases · good for legacy systems · traceability and accountability | Complex · needs strong DevOps · frequent merge conflicts · longer path to production · steeper learning curve |
| **Feature branching** | Concurrent feature development · isolates work · reduces risk in main | Merge conflicts still occur · inherits complexity from both · can delay production readiness |

The most important thing is to pick one that fits your team and implement it properly. The worst case is having no workflow at all — ad-hoc releases with no visibility or accountability.

> **Opinion:** if you're starting fresh with no legacy baggage, I'd recommend trunk-based. In practice, three long-lived branches (`main`, `qa`, `develop`) is what a lot of teams are comfortable with, and it makes development smoother if you're dealing with legacy software or don't have robust test automation. I'm not a big fan of feature branching — the hybrid takes on the negatives of both without enough of the benefits.

---

## CI/CD

*Where the art of pushing buttons turns into the science of keeping your app from going up in flames.*

CI/CD is one of the most useful yet misunderstood terms in the industry. **Continuous Integration** and **Continuous Delivery/Deployment** are distinct concepts, and you can have one without the other.

- **CI** automates merging code from multiple developers, running tests, and building the project.
- **CD** automates deployments to production and other environments.

There are plenty of tools, and I'd set them up early — it's easier at the start and gets progressively harder the longer you leave it. If you're on GitHub, use **GitHub Actions**; it's powerful and the marketplace has excellent community support.

> **Important:** as an early-stage company, **do not start with microservices**, even if you expect to need them later. Most frameworks let you separate components when the time comes. Start with a **monolith** on managed services like Elastic Beanstalk, Heroku, or Vercel, and use managed databases. They might cost more, but not worrying about losing data is worth it.

All the major cloud providers offer managed services that handle the DevOps overhead so you can focus on the product. Since they're containerised, you can migrate to Kubernetes or your own clusters later if you need to.

In the early stages your goal is to move fast, deploy features, and find product-market fit. These decisions will incur **technical debt** and you'll likely refactor later. That's a good problem to have.

> **Opinion:** if you're deploying manually, I guarantee you'll spend more time on it than setting up CD would have cost. And as you scale you'll likely rebuild anyway — the decisions you make at 1,000 users won't hold at 50,000 or 500,000. Over-optimising for scale too early only slows down feature development.

---

## Monitoring and Error Tracking

*Because relying on your resident superhero to fix everything makes for great stories and a terrible strategy.*

Error tracking and performance monitoring are usually afterthoughts at early-stage companies. Engineers often talk to customers directly, so they fix things as they come up or when users report them.

What typically happens: one highly skilled engineer who knows the codebase well ends up bombarded with user queries and issues, which destroys their productive time. Every startup has that one "maverick" who fixes everything.

This **firefighting culture** is common and deeply counterproductive. The right approach is to fix the issue properly, or let the team handle it without one person constantly jumping in.

It arises because there's no proper logging or monitoring and only a few people have production access. Even when other team members *could* fix something, the maverick dives in to save the day. Great stories, terrible developer experience.

### Fixing it

With today's tooling this is straightforward. Pick a central logging tool — **Loggly**, **Papertrail**, or your cloud provider's own. What matters is that the **team** can see production logs without needing access to production servers.

Add something like **Sentry** to alert the team when an exception fires. Most frameworks have built-in error tracking too, if you'd rather avoid a third party.

> **Opinion:** the biggest ROI I've seen on any of this is Sentry — crashes reported to the whole team, and a bug filed automatically in the tracker.

Use something like **New Relic** to track performance and speed as well. You don't need everything optimised, but it's good to know what could be improved when the team has downtime.

The goal is to be **proactive** rather than **reactive**.

---

## Security

*Security feels like an afterthought until one wrong click makes it your only thought.*

Security takes a back seat at most early-stage startups, but it's one area you can't afford to ignore — a single breach could sink the company. Fortunately the basics cut your risk substantially for very little effort.

1. **User authentication** — use a provider like Auth0, Clerk, or Firebase and offload authentication management.
2. **Group-based access control** — group privileges, and follow the principle of least privilege.
3. **Password managers and SSO** — 1Password or similar, with SSO for centralised access.
4. **Secure cloud storage** — encrypt files, disable public access by default, use signed URLs, audit permissions regularly.
5. **Regular software updates** — schedule them to patch vulnerabilities before they become tech debt.
6. **Web application firewall** — block malicious traffic and common exploits.
7. **Encrypt sensitive data** — never store passwords in plaintext. Hash and encrypt.
8. **Always use SSL** — protect data in transit.

Starting early prevents much bigger problems later.

---

The through-line across all of it: every one of these is a mechanism rather than an intention. A style guide you've automated survives a busy week; one you agreed to verbally doesn't. A hook runs whether or not anyone remembered. Sentry emails the team whether or not the maverick is on holiday.

Pick the ones that fit where you are, implement them properly, and move on to building the product.
