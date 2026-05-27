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

3. Use `presentation-research` before authoring.
   - Create `research.md` and `sources.json` in the deck directory.
   - Prefer official docs, source repositories, standards, papers, maintainer posts, and project release notes.
   - Browse for current sources when the topic involves modern frameworks, APIs, products, versions, or comparisons.
   - Track every source used so the final deck can include a grouped references slide.

4. Use `presentation-outline`.
   - Create `claims.json` before writing slides.
   - Every slide should have a learning objective, core claim, supporting source ids, visual requirement, and practical takeaway.

5. Use `presentation-visual-plan`.
   - Create `visuals.md` before or during authoring.
   - Aim for one visual aid every 4-6 slides.
   - Include at least one visual for every major taxonomy, lifecycle, architecture, runtime flow, data flow, or decision framework.
   - Prefer deterministic HTML/CSS visuals for technical diagrams, with labels and text controlled by code.
   - Use generated bitmap images only for conceptual non-text visuals; do not rely on image generation for labels, code, tables, or small text.

6. Draft the deck as pure static HTML.
   - Place decks under `slides/<topic>/<deck>/index.html`.
   - Use the shared reveal.js layout, shared CSS, persistent presentation topbar, and local assets.
   - Include title, learning goals, conceptual framing, technical detail, practical guidance, recap, and final references slides.
   - For technical content, prefer mechanisms, interfaces, state flow, failure modes, code-level examples, and tradeoffs.
   - Use real HTML formatting. Inline code in prose must be `<code>...</code>`, not markdown-style backticks.
   - Avoid slide text overflow by using compact copy, responsive grids, stable dimensions, and smaller text inside cards/panels.

7. Add visual support.
   - Prefer local diagrams built in HTML/CSS when that gives precise control.
   - For PNG assets, author reproducible sources under `visuals/<topic>/<deck>/` and render them with `node scripts/render-visuals.mjs` to `assets/img/<topic>/<deck>/`.
   - Mark custom in-slide visual aids with `data-visual` when they are not images or one of the shared diagram classes.
   - Every `<img>` must use a local source and useful `alt` text.
   - If embedding an existing external image, copy it into the repo and cite the source page in the references slide.

8. Update catalog metadata after the deck is drafted.
   - Edit `assets/js/catalog.js`.
   - Include summary, coverage outline, learning goals, estimated duration, slide count, last updated date, and tags.
   - Generate tags from actual deck content after authoring.
   - Use canonical lowercase slugs and useful concept-level labels; avoid near-duplicates.

9. Validate locally.
   - Run `node scripts/validate-site.mjs`.
   - Use local files or a local static server for browser checks and screenshots.
   - Do not wait for public GitHub Pages deployment to validate the content.
   - Fix structural, rendering, metadata, reference, image accessibility, and inline-code issues before committing.
   - Treat visual-aid warnings as prompts to add or improve visuals for substantial decks.

10. Commit and push a vertical slice when requested by the repo workflow.
   - Stage only task-local files.
   - Use Conventional Commit format.
   - Leave unrelated dirty changes alone.
   - Push after the commit.

## Completion Checklist

- Deck exists under `slides/<topic>/<deck>/index.html`.
- Research artifacts exist: `research.md`, `sources.json`, `claims.json`, and `visuals.md`.
- Catalog entry is complete and tags are useful.
- Catalog entry includes a `lastUpdated` date in `YYYY-MM-DD` format.
- Every source used is listed on the deck's references slide, grouped by concept.
- Visual aids are planned, local, accessible, and frequent enough for the deck's length.
- Local validation passes.
- Visual spot checks show no obvious overflow or broken navigation.
- Changes are committed and pushed as a self-contained slice.
