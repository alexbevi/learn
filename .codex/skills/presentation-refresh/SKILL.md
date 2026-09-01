---
name: presentation-refresh
description: Apply user-approved fixes to an older Learn repository presentation after a read-only validation finds source drift, changed APIs, stale metadata, missing artifacts, visual gaps, or broken links. Do not use for an initial audit.
---

# Presentation Refresh

Refresh a deck without changing its core learning promise.

## Workflow

1. Identify the deck and run:
   - `node scripts/validate-site.mjs`

2. Review drift-prone content.
   - APIs, SDKs, commands, version statements, support matrices, pricing or
     product naming, current best practices, and operational guidance.

3. Use `presentation-validate` for the read-only review.
   - Summarize issues and ask before applying fixes. Stop until the user approves
     the findings.

4. Update `visuals.md` when the deck is visually thin.
   - Plan deterministic visuals for dense concept clusters before editing HTML.

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
