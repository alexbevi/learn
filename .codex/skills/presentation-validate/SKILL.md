---
name: presentation-validate
description: Audit a Learn repository presentation without editing it. Covers teaching quality, structure, rendered layout, source coverage, and claim-by-claim factual accuracy against current primary sources; fixes require a separate user approval.
---

# Presentation Validate

## Overview

Validate a Learn presentation for teaching quality, structural health,
rendering readiness, and factual accuracy against current primary sources. If
issues are found, summarize them and ask the user before changing the deck.

## Validation Workflow

1. Identify the target deck.
   - Use the user's topic/deck name, `assets/js/catalog.js`, or the path under `slides/<topic>/<deck>/index.html`.
   - If multiple decks match and choosing one would be risky, ask one concise clarification question.

2. Run local structural validation first.
   - From `/Users/alex/Workspace/learn`, run `node scripts/validate-site.mjs`.
   - Run `node scripts/render-deck.mjs <deck-id>` and inspect its
     `report.json`, contact sheet, and flagged slides.
   - Record failures before deeper content review.
   - Use local files or a local static server for any browser/rendering checks.
   - Do not wait for GitHub Pages deployment.
   - Treat visual-aid warnings as presentation quality findings, especially for new or heavily updated decks.

3. Extract the claims to verify.
   - Read the deck HTML, catalog metadata, and repo-local artifacts when present:
     `research.md`, `sources.json`, `claims.json`, and `visuals.md`.
   - Identify concrete claims: API names, framework capabilities, version-sensitive behavior, architectural comparisons, code examples, diagrams, operational guidance, performance claims, and security claims.
   - Identify visual gaps: concepts that would be clearer as taxonomy, flow, architecture, lifecycle, comparison, or data-plane visuals.
   - Note slide numbers or section labels for every claim cluster.
   - If `claims.json` is missing, mention that the deck cannot be audited against a formal slide contract.
   - If `sources.json` is missing or mostly secondary sources, mention source coverage risk.
   - For a claim-by-claim request, include every concrete API, version,
     architecture, operational, performance, security, and code claim rather
     than sampling.

4. Check sources of truth on the web.
   - Browse for current primary sources whenever the claim involves modern tools, APIs, products, releases, or comparisons.
   - Prefer official docs, source repositories, specifications, release notes, papers, and maintainer-authored material.
   - Use secondary sources only to supplement context, not as the source of truth for technical claims.
   - Collect source URLs and cite them in the response.

5. Compare the deck to the sources.
   - Mark each issue with severity:
     - `High`: materially wrong, outdated in a way that changes the lesson, unsafe guidance, broken code/API usage, or misleading comparison.
     - `Medium`: partially true but missing an important constraint, lifecycle stage, version caveat, or tradeoff.
     - `Low`: wording ambiguity, source gap, stale terminology, or minor citation/metadata issue.
   - Separate verified facts from inferences.
   - Note any areas not fully checked because sources were unavailable or ambiguous.

6. Review teaching quality.
   - Read and apply the
     [presentation quality rubric](../../../docs/presentation-quality-rubric.md).
   - Score all eight dimensions from 1 to 4 using evidence in the deck and its
     artifacts.
   - Report the average and the two changes most likely to improve learning.
   - Do not treat the score as a substitute for a serious factual, structural,
     or rendering finding.

7. Report before editing.
   - Lead with findings, ordered by severity, each with slide reference, issue, source-backed correction, and source links.
   - Include local validation status and source coverage.
   - Include artifact coverage: whether `research.md`, `sources.json`, `claims.json`, and `visuals.md` exist and appear current.
   - Include the quality-rubric scores with one concrete piece of evidence per
     dimension.
   - If there are factual or structural issues, ask: "Do you want me to apply these fixes to the presentation?"
   - Do not update deck files until the user confirms.

## Fix Workflow After Confirmation

When the user confirms fixes:

1. Update the deck, catalog metadata, references slide, last updated date, and tags as needed.
2. Preserve the existing visual system and use `<code>...</code>` for inline code.
3. Add or adjust visual aids when the validation issue is conceptual clarity or visual density.
4. Add or adjust references so every corrected concept has a source.
5. Run `node scripts/validate-site.mjs`.
6. Perform local browser or screenshot checks when layout risk is non-trivial.
7. Commit and push a self-contained Conventional Commit if this repository workflow calls for commits.

## No-Issue Response

If no issues are found, say that clearly. Include validation status, the primary sources checked, and any residual risk such as version drift or source ambiguity.
