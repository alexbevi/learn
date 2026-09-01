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
     - learner problem or before-state this concept addresses
     - after-state or capability the concept enables
     - extracted claims
     - concrete mechanisms, APIs, protocols, runtime paths, or flows
     - implementation details, configuration surfaces, and code-level handles
     - versions and local commands that can verify planned examples
     - operational or implementation implications
     - knobs, limits, failure modes, security concerns, or observability signals
     - example workload or scenario where the concept matters
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
- Avoid feature-tour research. If a section only says what a product offers,
  expand it until it explains how the feature works, when it matters, where it
  breaks down, and what a practitioner should do with it.
- Research should be strong enough that an outline can answer "why", "how",
  "what changes", and "what can go wrong" without inventing unsupported detail.
- For technical examples, identify a supported version and a practical way to
  run, compile, parse, or otherwise verify the example. If verification is not
  practical, explain why the deck should use clearly labeled pseudocode.
