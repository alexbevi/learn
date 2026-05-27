# Learn

Static HTML presentations for technical and product learning.

The site is designed for GitHub Pages and does not require a build step. Each
deck is a committed HTML slideshow with local CSS, JavaScript, images, and
references.

## Local Preview

Open `index.html` directly in a browser, or serve the repository root with any
static server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080/`.

## Validation

Validate the committed local site before pushing:

```bash
node scripts/validate-site.mjs
```

The validator checks local files, catalog metadata, deck slide counts, required
references slides, tags, internal links/assets, empty image assets, generated
PNG/source pairing, image accessibility, visual-aid cadence, research-artifact
presence, and local HTTP smoke URLs. Do not wait for GitHub Pages deployment as
the primary validation signal; Pages is only the publishing target.

Visual-aid cadence currently reports warnings rather than failures so older decks
remain valid. Treat those warnings as authoring feedback for new or materially
updated presentations.

External source links can be checked on demand:

```bash
node scripts/check-source-links.mjs <deck-id>
```

Research artifact templates can be created for an existing catalog deck:

```bash
node scripts/scaffold-presentation-artifacts.mjs <deck-id>
```

## Structure

- `index.html` lists topics, presentations, and filterable tags.
- `topics/<topic>/index.html` lists presentations for one topic.
- `slides/<topic>/<deck>/index.html` contains a reveal.js slideshow.
- `assets/js/catalog.js` is the source of truth for topics, presentations,
  summaries, learning goals, duration, slide count, last updated dates, and tags.
- `assets/vendor/reveal/` contains the vendored reveal.js runtime.
- `assets/img/` stores local visual assets used by decks.
- `visuals/` stores reproducible HTML/CSS sources for rendered PNG visual aids.
- `scripts/render-visuals.mjs` renders `visuals/**/*.html` to matching PNGs
  under `assets/img/`.
- `scripts/scaffold-presentation-artifacts.mjs` creates starter research,
  source, claim, and visual-plan artifacts for a deck.
- `scripts/check-source-links.mjs` checks external source links when network
  validation is appropriate.
- Substantial decks may include `research.md`, `sources.json`, `claims.json`,
  and `visuals.md` beside `index.html`.

## Content Workflow

Presentation creation is handled through repo-local Codex skills so intake,
research, outline, visual planning, authoring, metadata, validation, commit, and
push stay consistent. Project skill definitions live under `.codex/skills/` and
should remain repo-local rather than being installed under `$CODEX_HOME/skills/`.

The staged workflow is:

- `presentation-research`: create `research.md` and `sources.json`.
- `presentation-outline`: create `claims.json` as the slide contract.
- `presentation-visual-plan`: create `visuals.md` and required diagram plans.
- `presentation-create`: author the HTML deck and catalog slice.
- `presentation-claim-check`: audit claims against current sources of truth.
- `presentation-refresh`: revisit older decks for drift, visuals, and metadata.

When creating a new learning plan:

1. Prompt the user conversationally, one focused question at a time, to shape
   scope, audience, technical depth, and desired examples.
2. Research from primary sources and write `research.md` plus `sources.json`.
3. Write `claims.json` with one slide contract per planned slide: learning
   objective, core claim, source ids, visual requirement, and practical
   takeaway.
4. Create a visual inventory in `visuals.md`. Aim for one visual aid every 4-6
   slides and at least one visual for each major taxonomy, lifecycle,
   architecture, runtime flow, data flow, or decision framework.
5. Build the deck as static HTML using the shared slide layout and local assets.
6. Prefer deterministic HTML/CSS visuals for technical diagrams. Render
   reproducible PNG assets with:

   ```bash
   node scripts/render-visuals.mjs
   ```

   The convention is `visuals/<topic>/<deck>/<name>.html` to
   `assets/img/<topic>/<deck>/<name>.png`.
   Mark custom in-slide visual aids with `data-visual` when they are not images
   or one of the shared diagram classes.
7. Use generated PNGs for conceptual non-text imagery only. Keep labels, code,
   arrows, and small text in HTML/CSS or rendered deterministic visuals.
8. Add a final references slide grouped by concept.
9. Generate tags after the deck is drafted, based on actual concepts covered.
10. Update `assets/js/catalog.js` with the final summary, learning goals,
   duration estimate, slide count, last updated date, and tags.
11. Validate local links, assets, slide count, references, tags, and local HTTP
   smoke URLs with `node scripts/validate-site.mjs`.
12. Validate external source links with `node scripts/check-source-links.mjs`
    when network conditions allow.

For factual review, use `presentation-claim-check` or `presentation-validate`.
They run local structural validation, check deck claims against current web
sources of truth, summarize issues by severity, and ask before applying
presentation fixes.

## Tagging

Tags are for future discovery by concept, not for mirroring every keyword.

Prefer reusable labels such as `agent-development`, `langgraph`,
`state-management`, `persistence`, `vector-search`, and `observability`. Avoid
near-duplicates like `database`, `databases`, and `db`; choose one canonical
tag.

Most substantial decks should have 6-12 tags across useful dimensions:

- technology
- architectural concept
- infrastructure role
- audience or use case

## GitHub Pages

The repository deploys via GitHub Actions from the repository root. If Pages is
not already enabled, set the repository's Pages source to GitHub Actions.
