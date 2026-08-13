---
description: Run the Product Advisor (Codex read-only product/UX/UI/accessibility review gate)
argument-hint: "[pre-implementation|post-implementation] [feature or notes]"
---

Invoke the **product-advisor** skill now and follow it exactly.

Arguments (optional): `$ARGUMENTS`
- If the first token is `pre-implementation` or `post-implementation`, use it as the
  consultation mode. Otherwise default to `pre-implementation`.
- Treat any remaining text as the feature/topic to review.

Steps:
1. Load the skill at `.claude/skills/product-advisor/SKILL.md` and obey its workflow.
2. Assemble the focused context package the skill describes (never include secrets,
   `.env`, or private data).
3. Run `node .claude/skills/product-advisor/scripts/consult-codex.mjs` with the chosen
   `--mode` and the context, and save the returned review so I can read it.
4. If the wrapper reports Codex is missing or cannot run read-only, tell me the exact
   one-time setup step instead of fabricating a review.
5. Address every `MUST`, state accept/reject (with reasons) for each recommendation,
   and revise the plan. Never claim Codex approved unless the verdict is `PROCEED`.
