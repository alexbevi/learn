---
name: presentation-create
description: Use when creating or materially updating static HTML learning presentations in /Users/alex/Workspace/learn, including conversational intake, source-grounded research, deck authoring, metadata/tag updates, local validation, commit, and push.
---

# Presentation Create

## Overview

Create source-grounded, static HTML learning decks for the Learn repository. The output is a complete vertical slice: deck files, local assets, catalog metadata, validation, commit, and push.

## Workflow

1. Orient in `/Users/alex/Workspace/learn`.
   - Read `AGENTS.md`, `README.md`, `assets/js/catalog.js`, and the closest existing deck before making changes.
   - Treat the local checkout as the source of truth.
   - Keep GitHub Pages deployable as static files and avoid adding a required build step.

2. Run conversational intake when the user is asking to learn about a new topic.
   - Ask one focused question at a time.
   - Do not list all intake questions up front.
   - Establish audience, depth, implementation language/ecosystem, product vs technical emphasis, a practical anchor example, and out-of-scope areas.
   - Once direction is clear, proceed with reasonable defaults instead of over-questioning.

3. Research from primary or high-authority sources.
   - Prefer official docs, source repositories, standards, papers, maintainer posts, and project release notes.
   - Browse for current sources when the topic involves modern frameworks, APIs, products, versions, or comparisons.
   - Track every source used so the final deck can include a grouped references slide.

4. Draft the deck as pure static HTML.
   - Place decks under `slides/<topic>/<deck>/index.html`.
   - Use the shared reveal.js layout, shared CSS, persistent presentation topbar, and local assets.
   - Include title, learning goals, conceptual framing, technical detail, practical guidance, recap, and final references slides.
   - For technical content, prefer mechanisms, interfaces, state flow, failure modes, code-level examples, and tradeoffs.
   - Use real HTML formatting. Inline code in prose must be `<code>...</code>`, not markdown-style backticks.
   - Avoid slide text overflow by using compact copy, responsive grids, stable dimensions, and smaller text inside cards/panels.

5. Add visual support only when it improves comprehension.
   - Prefer local diagrams built in HTML/CSS/SVG when that gives precise control.
   - Generated bitmap images are acceptable for conceptual visuals.
   - If embedding an existing external image, copy it into the repo and cite the source page in the references slide.

6. Update catalog metadata after the deck is drafted.
   - Edit `assets/js/catalog.js`.
   - Include summary, coverage outline, learning goals, estimated duration, slide count, and tags.
   - Generate tags from actual deck content after authoring.
   - Use canonical lowercase slugs and useful concept-level labels; avoid near-duplicates.

7. Validate locally.
   - Run `node scripts/validate-site.mjs`.
   - Use local files or a local static server for browser checks and screenshots.
   - Do not wait for public GitHub Pages deployment to validate the content.
   - Fix structural, rendering, metadata, reference, and inline-code issues before committing.

8. Commit and push a vertical slice when requested by the repo workflow.
   - Stage only task-local files.
   - Use Conventional Commit format.
   - Leave unrelated dirty changes alone.
   - Push after the commit.

## Completion Checklist

- Deck exists under `slides/<topic>/<deck>/index.html`.
- Catalog entry is complete and tags are useful.
- Every source used is listed on the deck's references slide, grouped by concept.
- Local validation passes.
- Visual spot checks show no obvious overflow or broken navigation.
- Changes are committed and pushed as a self-contained slice.
