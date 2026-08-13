---
name: product-advisor
description: >-
  Independent product, UX, UI, and accessibility review powered by the OpenAI
  Codex CLI, used as a second-opinion advisor BEFORE and AFTER building anything
  user-facing. Use this skill whenever you are planning a new feature, changing
  an existing user flow, adding or substantially modifying a screen or
  interaction, making navigation or information-architecture decisions, reviewing
  feature UX or UI, writing a feature spec or implementation plan, deciding
  whether a feature should exist at all, or preparing a feature for release —
  even if the user does not say the words "review" or "advisor". Invoke it before
  you implement (to challenge the concept and plan) and again after you implement
  (to review the built experience). Codex is advisory and strictly read-only; it
  must never modify the repository. Do NOT use this skill for trivial refactors,
  formatting, dependency bumps, or narrowly scoped bug fixes with no
  user-experience impact. Also runs manually as /product-advisor.
---

# Product Advisor

This skill gives you an independent adversarial reviewer for anything
user-facing. It runs the OpenAI **Codex** CLI in a **read-only** sandbox as a
senior product strategist / UX architect / interaction designer / UI reviewer /
accessibility advocate whose job is to *disagree well* — to challenge your plan
before you build it, not to rubber-stamp it.

You (Claude) remain responsible for the final decision. Codex advises; the user's
instructions and the repository's own evidence are authoritative. Never claim
Codex "approved" anything unless its verdict is literally `PROCEED`.

## When to run it

Run a **pre-implementation** consultation before you write code for any of:
planning a new feature; changing an existing user flow; adding or substantially
changing a screen or interaction; navigation / information-architecture
decisions; writing a feature spec or implementation plan; or deciding whether a
feature should exist at all.

Run a **post-implementation** consultation after you build something that
materially affects UI or UX, before you call it done.

Skip it for trivial refactors, formatting, dependency maintenance, and small
bug fixes with no user-experience impact — pestering Codex about those wastes the
user's time and trains everyone to ignore the gate.

## The workflow

1. **Investigate and draft.** Understand the requested feature. Read the relevant
   product, design-system, and architecture docs that exist *in this repository*
   (e.g. `README`, `docs/`, `CLAUDE.md`, `AGENTS.md`, design tokens, component
   libraries, prior specs, screenshots/mockups). Draft your proposed solution and
   the user journey.
2. **Consult before implementing.** Assemble the context package (below) and run
   the advisor in `pre-implementation` mode.
3. **Let Codex challenge you.** It will judge whether the feature should exist
   before how to build it, and return a structured review with a verdict.
4. **Respond to every material concern** (see "Responding to the review").
5. **Revise your plan**, then implement — and only then.
6. **Review the result.** After implementing something with real UI/UX impact,
   run the advisor again in `post-implementation` mode with a diff summary and
   verification evidence.

## Assembling the context package

Codex is only as good as what you give it. Build a focused Markdown package —
prefer references and short excerpts over dumping whole files. Include, as
applicable:

- The original feature request (the user's own words)
- The user problem being solved, and the target user / persona if known
- Your proposed solution and the proposed user journey
- Relevant existing behaviour it touches
- The files you expect to change
- Important technical or business constraints
- Relevant product & design documentation found in the repo (quote the key parts)
- Relevant screenshots or mockups when available (describe or reference them)
- Open questions and assumptions
- **Post-implementation only:** a concise diff summary and test/verification
  evidence (what you changed, what you tested, results)

**Never send secrets.** Do not include `.env` contents, credentials, API keys,
tokens, production data, or private user data. Do not paste irrelevant swaths of
the repository. If something sensitive is load-bearing to the review, describe it
abstractly instead of pasting it.

Write the package to a file (e.g. a temp file outside the repo, or a scratch path
the user is fine with) and pass it with `--context`, or pipe it in on stdin.

## Running the advisor

The wrapper is `scripts/consult-codex.mjs` (Node, no extra dependencies). Invoke
it with the runtime that is already present — Node ships with Claude Code:

```bash
# Pre-implementation (default mode): challenge the concept and the plan
node "<skill-dir>/scripts/consult-codex.mjs" --mode pre-implementation \
  --context /tmp/product-advisor-context.md \
  --cd "<repo-root>"

# Post-implementation: review the built experience
node "<skill-dir>/scripts/consult-codex.mjs" --mode post-implementation \
  --context /tmp/product-advisor-context.md \
  --cd "<repo-root>"

# Or pipe the context on stdin instead of --context:
cat /tmp/product-advisor-context.md | node "<skill-dir>/scripts/consult-codex.mjs" --mode pre-implementation
```

`<skill-dir>` is the directory containing this `SKILL.md`. Quote paths so
directories with spaces work. Default mode is `pre-implementation`.

Options: `--mode`, `--context FILE` (or stdin), `--cd DIR` (working root Codex
reasons about; default = current directory), `--model NAME` (optional Codex model
override), `--timeout SECONDS` (default 600).

The wrapper prints Codex's Markdown review to **stdout** and diagnostics to
**stderr**. It exits non-zero on failure. Meaningful exit codes: `2` bad
arguments / empty context, `3` Codex not installed, `4` timed out, `5` Codex ran
but failed (often authentication), `6` internal error.

### Read-only guarantee

The wrapper always runs `codex exec --sandbox read-only --ephemeral`, passes no
approval-bypass flags, and writes only to a temp file outside the working tree.
Codex therefore cannot edit files, install packages, commit, push, or deploy
during a consultation. If you want to prove it, capture `git status` /
`git diff` before and after the call — they must be identical.

### If Codex is unavailable

If the wrapper exits `3` (not installed) or `5` with an auth message, Codex is
not set up on this machine. Do **not** silently proceed as if reviewed, and do
**not** try to install or authenticate it yourself. Tell the user the exact
step — install with `npm install -g @openai/codex`, then `codex login` — and ask
whether to proceed without the review. The consultation gate is unmet until it
runs successfully.

## Responding to the review

After you get the review back you must actually engage with it — the point is a
better product, not a compliance stamp:

1. **Surface it.** Show the review to the user, or save it to a visible file and
   link it. Don't bury it.
2. **Address every `MUST`** item explicitly. For each, say how you'll satisfy it
   or why it doesn't apply.
3. **State what you accept and what you reject**, with a reason for each
   rejection. Codex is not an absolute authority; reconcile its feedback with the
   repository's evidence and the user's instructions.
4. **Revise the implementation plan** accordingly.
5. **Escalate real trade-offs.** If resolving a disagreement would materially
   change product scope, ask the user for direction rather than deciding
   unilaterally.
6. **Honour the verdict:**
   - `PROCEED` — you may implement after addressing any `MUST`/`SHOULD` items.
   - `REVISE` — revise and, for substantial changes, re-consult before building.
   - `REJECT` — do not implement as proposed; rethink or take it back to the user.
   - `INSUFFICIENT_CONTEXT` — treat this as a **failed gate**. Gather the missing
     context the review names, then consult again. Do not implement on an
     `INSUFFICIENT_CONTEXT` result.
7. **Never overstate it.** Only say Codex approved the feature when the verdict is
   `PROCEED`.

## What Codex returns

Codex must reply using the exact contract in `references/review-contract.md`
(read it if you need the precise section list). The top-level shape:

```
# Product Review
## Verdict            -> PROCEED | REVISE | REJECT | INSUFFICIENT_CONTEXT
## Executive assessment
## User problem
## Product fit
## Strongest challenge
## Recommended experience
## Alternatives considered
## UX and UI requirements
## Accessibility requirements
## Edge cases and failure states
## Measurement
## Risks and open questions
## Required changes before implementation   (MUST / SHOULD / COULD checklist)
## Acceptance criteria
```

The role, the full assessment checklist, and this response contract all live in
`references/review-contract.md`, which the wrapper injects into Codex on every
call. To change what the advisor evaluates or how it responds, edit that file —
not the wrapper.
