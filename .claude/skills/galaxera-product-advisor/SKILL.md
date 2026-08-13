---
name: galaxera-product-advisor
description: Consult an independent OpenAI Codex product/UX/UI/accessibility advisor before building or after shipping Galaxera (Niloosa) user-facing work. Use this when planning a new feature, changing an existing user flow, adding or substantially modifying a screen or interaction, making navigation or information-architecture decisions, reviewing feature UX or UI, writing a feature spec or implementation plan, deciding whether a feature should exist, or preparing a feature for release. Also invoke manually as /galaxera-product-advisor. Do NOT use for trivial refactoring, formatting, dependency maintenance, or a narrowly scoped bug fix with no user-experience impact.
---

# Galaxera Product Advisor

An independent product, UX, UI, accessibility, and strategy review powered by
**OpenAI Codex**, run as a **read-only advisor**. Codex challenges Claude's
proposal from the user's side of the screen — it never edits the repository.

Codex is an advisor, not an authority. Claude reconciles its feedback with
repository evidence and the user's instructions, which remain authoritative.

## When to use it

Invoke **before implementing** (default) whenever the work is materially
user-facing: a new feature, a changed flow, a new/reworked screen or interaction,
a navigation or information-architecture decision, a feature spec or plan, or a
"should this exist?" question. Invoke **after implementing** when the change
materially affects UI or UX, to review the built experience.

Skip it for trivial refactors, formatting, dependency bumps, and small bug fixes
with no user-experience impact.

## The gated workflow

1. **Draft.** Investigate the requested feature and write a proposal.
2. **Consult (pre-implementation).** Run the advisor on the proposal.
3. **Codex challenges** the proposal across product, UX, UI, accessibility, and
   strategy, and returns a verdict.
4. **Respond.** Address every `MUST`, accept/reject each recommendation (with a
   reason for each rejection), and revise the plan.
5. **Implement** only after the gate is cleared.
6. **Review (post-implementation, optional).** Re-run the advisor on the result.

## How to run the consultation

The advisor runs through a small Node wrapper (no new dependencies; it reuses the
repo's Node runtime). Assemble a focused context package and pass it in.

```bash
# pre-implementation (default) — context from a file
node .claude/skills/galaxera-product-advisor/scripts/consult-codex.mjs \
  --mode pre-implementation --context /path/to/context.md

# post-implementation — context piped on stdin
cat context.md | node .claude/skills/galaxera-product-advisor/scripts/consult-codex.mjs \
  --mode post-implementation
```

Options: `--mode pre-implementation|post-implementation` (default
`pre-implementation`), `--context <file>` (or pipe context on stdin),
`--timeout <ms>` (default 180000, or `CODEX_TIMEOUT_MS`). Set `CODEX_BIN` if
Codex lives at a non-standard path.

Save the returned review to a visible location, e.g.:

```bash
node .claude/skills/galaxera-product-advisor/scripts/consult-codex.mjs \
  --context context.md > review.md
```

The wrapper prints Codex's Markdown review to stdout and exits non-zero on
failure. Exit codes: `2` = Codex not installed (setup needed), `3` = installed
Codex can't be guaranteed read-only (refused), `4` = spawn error/timeout,
`5` = Codex ran but errored. If it exits `2` or `3`, tell the user the exact
one-time setup step and do not fake a review.

## The context package Claude must assemble

Write a focused Markdown file (excerpts and references, never a repo dump). Do
**not** include secrets, `.env` contents, credentials, production data, or
private user data. Include:

- The original feature request
- The user problem being solved
- Target user / persona, if known
- Claude's proposed solution and proposed user journey
- Relevant existing behaviour
- Files Claude expects to change
- Important technical/business constraints
- Relevant product & design docs from the repo (e.g. `PRODUCT_SPEC.md`,
  `docs/SYSTEM_DESIGN.md`, `CLAUDE.md`, design-system notes)
- Relevant screenshots/mockups when available
- Open questions and assumptions
- **Post-implementation only:** a concise diff summary and test/verification evidence

## What Codex returns

A Markdown document titled `# Galaxera Product Review` with a `Verdict` of
`PROCEED | REVISE | REJECT | INSUFFICIENT_CONTEXT`, a prioritized
`Required changes before implementation` checklist (MUST/SHOULD/COULD), and
testable `Acceptance criteria`. The full contract is in
[`references/review-contract.md`](references/review-contract.md).

## Claude's obligations after the review

1. Show or save the review so the user can read it.
2. Address every `MUST` item explicitly.
3. State which recommendations you accept or reject, with a reason per rejection.
4. Revise the implementation plan.
5. Ask the user for direction if a disagreement would materially change scope.
6. **Never claim Codex approved the feature unless the verdict is `PROCEED`.**
7. Treat `INSUFFICIENT_CONTEXT` as a failed gate: gather the missing context and
   re-run before implementing.

## Guarantees

- **Read-only.** Codex runs in a read-only sandbox; it cannot edit, install,
  commit, push, or deploy. If the installed CLI can't guarantee read-only, the
  wrapper refuses to run (exit `3`) rather than risk side effects.
- **No secrets.** The wrapper never logs environment variables or credentials;
  only the context you assemble is sent.
- **Advisory only.** The verdict informs Claude's plan; it does not override the
  user.
