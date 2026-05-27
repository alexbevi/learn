---
name: presentation-refresh
description: Use when refreshing older Learn repository presentations for source drift, changed APIs, stale metadata, missing research artifacts, visual quality gaps, broken links, and local validation issues.
---

# Presentation Refresh

Refresh a deck without changing its core learning promise.

## Workflow

1. Identify the deck and run:
   - `node scripts/validate-site.mjs`

2. Review drift-prone content.
   - APIs, SDKs, commands, version statements, support matrices, pricing or
     product naming, current best practices, and operational guidance.

3. Use `presentation-claim-check` for factual review.
   - Summarize issues and ask before applying fixes.

4. Use `presentation-visual-plan` when the deck is visually thin.
   - Add deterministic visuals for dense concept clusters.

5. Refresh artifacts.
   - Add or update `research.md`, `sources.json`, `claims.json`, and
     `visuals.md` when absent or stale.

6. Update deck metadata.
   - `lastUpdated`
   - tags, if concepts materially changed
   - slide count and duration, if changed

7. Validate locally and commit a focused slice.

## Guardrails

- Preserve the deck's topic and practical anchor unless the user asks for a
  rewrite.
- Do not silently change factual claims after validation; summarize and ask.
- Leave unrelated dirty changes alone.
