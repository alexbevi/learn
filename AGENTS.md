@RTK.md

# Learn Repository Instructions

This repository contains static HTML learning decks. Treat the local checkout as
the source of truth.

## Agent Skills

- Project skill definitions live under `.codex/skills/`.
- Keep these skills repo-local. Do not install or maintain global copies under
  `$CODEX_HOME/skills/`.
- Use the `presentation-create` Codex skill when creating or materially
  updating a learning presentation.
- Use the `presentation-validate` Codex skill when auditing a presentation
  for structural health, rendering readiness, source coverage, or factual
  accuracy.
- Validation audits must check current web sources of truth for technical claims
  and summarize issues before applying fixes. Ask the user before changing a deck
  in response to validation findings.

## Project Constraints

- Keep the site deployable as static files on GitHub Pages.
- Do not introduce a required build step unless explicitly requested.
- Keep runtime assets local. Avoid CDN dependencies for deck rendering.
- Use `reveal.js` from `assets/vendor/reveal/` for slideshows.
- Use `assets/js/catalog.js` as the presentation metadata source of truth.
- Use local validation as the acceptance signal. Do not wait for the public
  GitHub Pages deployment to validate content changes.

## Deck Authoring

- Each presentation must be a topical HTML slideshow under `slides/<topic>/<deck>/`.
- Use the shared slide CSS and reveal.js configuration pattern.
- Include a title slide, learning goals, conceptual framing, technical detail,
  practical guidance, recap, and a final references slide.
- Technical decks should be precise and can go deep. Prefer concrete mechanisms,
  interfaces, state flow, failure modes, and tradeoffs over vague summaries.
- Use real HTML for formatting. Inline code must use `<code>...</code>` rather
  than markdown-style backticks.
- Plan visual aids before authoring. Aim for one visual aid every 4-6 slides
  and at least one visual for each major taxonomy, lifecycle, architecture,
  runtime flow, data flow, or decision framework.
- Prefer deterministic HTML/CSS visuals for technical diagrams. If a bitmap
  asset is useful, author the source under `visuals/<topic>/<deck>/` and render
  it to a PNG under `assets/img/<topic>/<deck>/` with
  `node scripts/render-visuals.mjs`.
- Mark custom in-slide visual aids with `data-visual` when they are not images
  or one of the shared diagram classes, so local validation can count them.
- Use generated bitmap images only for conceptual, non-text visuals. Do not rely
  on image generation for labels, code, tables, or small text; overlay those in
  HTML instead.
- If an external image is embedded, copy it into the repo, add useful `alt`
  text, and cite its source page in the deck.

## References

- Every deck must end with a references slide.
- Group references by concept so follow-up reading is easy.
- Prefer primary sources: official docs, source repos, specifications, papers,
  or project-maintainer material.
- Cite all sources used to develop the content, not only sources quoted.

## Metadata And Tags

- Update `assets/js/catalog.js` after each deck is drafted.
- Presentation metadata must include summary, coverage outline, learning goals,
  estimated duration, slide count, last updated date, and tags.
- Generate tags after writing the deck so tags reflect actual content.
- Tags should optimize future discovery by concept.
- Prefer 6-12 tags for substantial decks.
- Use canonical lowercase slugs and stable human-readable labels.
- Avoid near-duplicates such as `database`, `databases`, and `db`.

## Validation

- Run `node scripts/validate-site.mjs` before committing presentation or catalog
  changes.
- Treat the local checkout, local static files, and local HTTP smoke test as the
  validation source of truth.
- Treat visual-aid warnings as authoring feedback. Existing decks may pass with
  warnings, but new substantial decks should meet or exceed the visual target.
- After pushing, GitHub Pages deployment may be checked for CI health, but do not
  block content validation on the public Pages URL or CDN cache.

## Learning Intake

When the user says they are ready to learn about something, prompt them
conversationally before creating the deck.

- Ask one focused question at a time.
- Do not list all intake questions up front.
- Let each answer shape the next prompt.
- Use reasonable defaults once the direction is clear.

The intake should establish:

- audience and current familiarity
- desired depth
- implementation language or ecosystem
- product versus technical emphasis
- preferred examples or systems to anchor on
- out-of-scope areas

Proceed with reasonable defaults when the answers are clear from context.

## Commits

- Commit vertical slices that are self-contained.
- Use Conventional Commit messages.
- Stage only task-local files.
- Leave unrelated dirty changes alone.
- Validate before committing when practical.
