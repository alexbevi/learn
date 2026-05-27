@RTK.md

# Learn Repository Instructions

This repository contains static HTML learning decks. Treat the local checkout as
the source of truth.

## Project Constraints

- Keep the site deployable as static files on GitHub Pages.
- Do not introduce a required build step unless explicitly requested.
- Keep runtime assets local. Avoid CDN dependencies for deck rendering.
- Use `reveal.js` from `assets/vendor/reveal/` for slideshows.
- Use `assets/js/catalog.js` as the presentation metadata source of truth.

## Deck Authoring

- Each presentation must be a topical HTML slideshow under `slides/<topic>/<deck>/`.
- Use the shared slide CSS and reveal.js configuration pattern.
- Include a title slide, learning goals, conceptual framing, technical detail,
  practical guidance, recap, and a final references slide.
- Technical decks should be precise and can go deep. Prefer concrete mechanisms,
  interfaces, state flow, failure modes, and tradeoffs over vague summaries.
- Use generated or local diagrams when they communicate the concept better than
  prose. If an external image is embedded, copy it into the repo and cite its
  source page in the deck.

## References

- Every deck must end with a references slide.
- Group references by concept so follow-up reading is easy.
- Prefer primary sources: official docs, source repos, specifications, papers,
  or project-maintainer material.
- Cite all sources used to develop the content, not only sources quoted.

## Metadata And Tags

- Update `assets/js/catalog.js` after each deck is drafted.
- Presentation metadata must include summary, coverage outline, learning goals,
  estimated duration, slide count, and tags.
- Generate tags after writing the deck so tags reflect actual content.
- Tags should optimize future discovery by concept.
- Prefer 6-12 tags for substantial decks.
- Use canonical lowercase slugs and stable human-readable labels.
- Avoid near-duplicates such as `database`, `databases`, and `db`.

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
