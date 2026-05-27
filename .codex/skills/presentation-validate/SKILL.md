---
name: presentation-validate
description: Use when auditing or fact-checking Learn repository HTML presentations against current sources of truth, including local structural validation, web-backed accuracy review, issue summary, and optional user-approved fixes.
---

# Presentation Validate

## Overview

Validate a Learn presentation for structural health, rendering readiness, and factual accuracy against current primary sources. If accuracy issues are found, summarize them and ask the user before changing the deck.

## Validation Workflow

1. Identify the target deck.
   - Use the user's topic/deck name, `assets/js/catalog.js`, or the path under `slides/<topic>/<deck>/index.html`.
   - If multiple decks match and choosing one would be risky, ask one concise clarification question.

2. Run local structural validation first.
   - From `/Users/alex/Workspace/learn`, run `node scripts/validate-site.mjs`.
   - Record failures before deeper content review.
   - Use local files or a local static server for any browser/rendering checks.
   - Do not wait for GitHub Pages deployment.

3. Extract the claims to verify.
   - Read the deck HTML and catalog metadata.
   - Identify concrete claims: API names, framework capabilities, version-sensitive behavior, architectural comparisons, code examples, diagrams, operational guidance, performance claims, and security claims.
   - Note slide numbers or section labels for every claim cluster.

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

6. Report before editing.
   - Lead with findings, ordered by severity, each with slide reference, issue, source-backed correction, and source links.
   - Include local validation status and source coverage.
   - If there are factual or structural issues, ask: "Do you want me to apply these fixes to the presentation?"
   - Do not update deck files until the user confirms.

## Fix Workflow After Confirmation

When the user confirms fixes:

1. Update the deck, catalog metadata, references slide, last updated date, and tags as needed.
2. Preserve the existing visual system and use `<code>...</code>` for inline code.
3. Add or adjust references so every corrected concept has a source.
4. Run `node scripts/validate-site.mjs`.
5. Perform local browser or screenshot checks when layout risk is non-trivial.
6. Commit and push a self-contained Conventional Commit if this repository workflow calls for commits.

## No-Issue Response

If no issues are found, say that clearly. Include validation status, the primary sources checked, and any residual risk such as version drift or source ambiguity.
