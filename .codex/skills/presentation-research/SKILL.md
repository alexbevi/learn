---
name: presentation-research
description: Use before creating or materially revising a Learn repository presentation when source-grounded research is needed; produces repo-local research.md and sources.json artifacts from primary sources, with claims, confidence, version sensitivity, gaps, and follow-up questions.
---

# Presentation Research

Build the evidence base before writing slides.

## Workflow

1. Identify the target deck path or proposed deck slug.
   - Existing deck: use `slides/<topic>/<deck>/`.
   - New deck: create the directory before writing artifacts.

2. Research from source-of-truth material.
   - Prefer official docs, specifications, standards, source repositories,
     maintainer posts, release notes, papers, and project-owned engineering
     material.
   - Use secondary sources only for context; do not let them carry core claims.
   - Browse for current sources when behavior may have changed.

3. Create `sources.json` in the deck directory.
   - Use an array of source objects.
   - Required fields: `id`, `title`, `url`, `sourceType`, `concepts`.
   - Recommended fields: `publisher`, `retrieved`, `updated`, `version`,
     `confidence`, `notes`.
   - `sourceType` should be `primary`, `secondary`, or `context`.
   - Target at least 70% primary sources.

4. Create `research.md` in the deck directory.
   - Group by concept, not by URL.
   - For each concept include:
     - source ids
     - extracted claims
     - mechanisms or flows
     - operational or implementation implications
     - version-sensitive areas
     - contradictions, gaps, or uncertainty

5. Do not author slides until the research artifact is coherent enough to
   support a slide plan.

## Quality Bar

- Every major mechanism in the eventual deck should have at least one primary
  source.
- Call out what the sources do not explain.
- Mark inferences explicitly.
- Prefer concrete behavior, APIs, metrics, state transitions, and failure modes
  over summary prose.
