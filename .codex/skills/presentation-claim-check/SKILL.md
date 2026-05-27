---
name: presentation-claim-check
description: Use to fact-check a Learn repository presentation claim-by-claim against current source-of-truth web sources and repo-local research artifacts; summarizes issues before applying fixes.
---

# Presentation Claim Check

Audit deck claims for accuracy and source support.

## Workflow

1. Run local structural validation:
   - `node scripts/validate-site.mjs`

2. Load the target deck and artifacts if present:
   - `index.html`
   - `research.md`
   - `sources.json`
   - `claims.json`

3. Extract concrete claims.
   - API names and options
   - version-sensitive behavior
   - architectural comparisons
   - operational metrics and tuning guidance
   - security, durability, or failure-mode claims
   - code examples and command snippets

4. Check sources of truth.
   - Browse current primary sources for modern products and APIs.
   - Prefer official docs, specs, source repos, release notes, and papers.
   - Mark unsupported claims, stale claims, ambiguity, and missing caveats.

5. Report before editing.
   - Findings first, ordered by severity.
   - Include slide reference, claim, issue, correction, and source URLs.
   - Ask whether to apply fixes if issues exist.

## Severity

- `High`: wrong, unsafe, broken API/code, or materially misleading.
- `Medium`: true only under missing constraints or version caveats.
- `Low`: unclear wording, missing citation, or weak source support.

## Fixing

Only update deck files after confirmation. Then update artifacts, references,
metadata, and run local validation.
