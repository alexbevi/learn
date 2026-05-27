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

## Structure

- `index.html` lists topics, presentations, and filterable tags.
- `topics/<topic>/index.html` lists presentations for one topic.
- `slides/<topic>/<deck>/index.html` contains a reveal.js slideshow.
- `assets/js/catalog.js` is the source of truth for topics, presentations,
  summaries, learning goals, duration, slide count, and tags.
- `assets/vendor/reveal/` contains the vendored reveal.js runtime.
- `assets/img/` stores local visual assets used by decks.

## Content Workflow

When creating a new learning plan:

1. Ask intake questions that shape scope, audience, technical depth, and
   desired examples.
2. Research from primary sources where possible.
3. Build the deck as static HTML using the shared slide layout and local assets.
4. Add a final references slide grouped by concept.
5. Generate tags after the deck is drafted, based on actual concepts covered.
6. Update `assets/js/catalog.js` with the final summary, learning goals,
   duration estimate, slide count, and tags.
7. Validate links, assets, slide count, references, and tag filtering.

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

