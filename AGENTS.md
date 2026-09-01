@RTK.md

# Learn Repository Instructions

This repository contains static HTML learning decks. Treat the local checkout as
the source of truth.

## Agent Skills

- Project skill definitions live under `.codex/skills/`.
- Keep these skills repo-local. Do not install or maintain global copies under
  `$CODEX_HOME/skills/`.
- Use `presentation-create` for new decks and material revisions. It
  orchestrates research, outlining, visual planning, authoring, and validation.
- Use `presentation-research` or `presentation-outline` directly only when the
  user requests that stage as a standalone deliverable.
- Use `presentation-validate` for read-only teaching-quality, structural,
  rendering, source, and claim-by-claim factual audits.
- Use `presentation-refresh` when revisiting an older deck for source or product
  drift after an audit.
- Validation audits must check current web sources of truth for technical claims
  and summarize issues before applying fixes. Ask the user before changing a deck
  in response to validation findings.

### Task routing

- Treat a change as light when it affects copy, styling, metadata, references,
  or fewer than five slides without changing the learning promise or adding
  material claims. Edit directly and run targeted validation.
- Treat a change as material when it creates a deck, changes the learning
  promise or practical anchor, changes a major architecture or comparison, or
  rewrites roughly 20 percent or more of the claim-bearing slides.
- Keep audits read-only. Use the user's approval of findings as the boundary
  between validation and implementation.

### Agent evaluation

- Treat changes to `AGENTS.md`, presentation skills, artifact schemas, and
  validation heuristics as agent behavior changes.
- Validate the case catalog with
  `node scripts/run-presentation-evals.mjs --validate`.
- For material behavior changes, prepare and run representative cases from
  `evals/presentation-agent/cases.json` in an isolated worktree or temporary
  repository copy. Give the agent under test only the case prompt.
- Score outcomes with the presentation quality rubric and case-specific
  criteria. Store generated packets and scorecards under `.artifacts/`.
- Compare behavior before and after instruction changes. Do not add a permanent
  rule for a single failure unless a representative case reproduces it.

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
- Substantial decks should include repo-local research artifacts beside
  `index.html`: `research.md`, `sources.json`, `claims.json`, and `visuals.md`.
  Treat these as the deck's source ledger, slide contract, and visual plan.
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

## Learning Quality

- Start substantial deck work with one observable learning promise: what the
  learner should be able to decide, build, diagnose, trace, or explain after
  the presentation.
- Name the learner's relevant before-state and the practical after-state. Do
  not use topic coverage as a substitute for a learning outcome.
- Use one or two recurring problems, systems, incidents, or decisions as the
  deck's practical anchors.
- Each major teaching section should contain a concrete mechanism, a worked
  example, a failure case or constraint, and a learner decision or practice
  prompt when the topic supports one.
- Substantial decks should include at least two active learning moments, such
  as predicting behavior, tracing a request, diagnosing a failure, selecting an
  architecture, or critiquing a design.
- The recap must answer the learning goals directly and give the learner a way
  to transfer the lesson to a new system or decision.
- Run technical examples against the stated version when practical. Record the
  verification command and expected result in the deck artifacts. Visibly label
  snippets that are illustrative or incomplete as pseudocode.
- Prefer a shorter coherent deck over an exhaustive deck. Remove accurate
  slides that do not change what the learner understands or can do.

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

- Review new and materially revised decks with
  `docs/presentation-quality-rubric.md` before completion. Score evidence in the
  deck, not the author's stated intent.
- New and materially revised decks should average at least 3.0 on the rubric
  with no dimension scored 1. Treat a lower score as a prompt to fix the
  teaching problem, not to add slides mechanically.
- For existing-deck audits, report rubric findings before proposing changes.
  Keep the audit read-only until the user approves fixes.
- Run `node scripts/validate-site.mjs` before committing presentation or catalog
  changes.
- Run `node scripts/render-deck.mjs <deck-id>` for new or materially revised
  decks. Inspect `report.json`, the contact sheet, and any flagged slides at the
  target viewport before completion.
- Run `node scripts/check-source-links.mjs <deck-id>` for source-link validation
  when creating, validating, or refreshing a deck with external references.
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

- the observable decision, task, diagnosis, or explanation the learner wants
  to perform afterward
- audience and current familiarity
- relevant prior knowledge and known points of confusion
- desired depth
- implementation language or ecosystem
- product versus technical emphasis
- preferred examples or systems to anchor on
- out-of-scope areas

Proceed with reasonable defaults when the answers are clear from context.

## Commits

- Treat validation as part of completing deck work. Treat commit and push as
  separate repository actions, not as presentation quality criteria.
- Commit only when the user requests it or the active task explicitly includes
  a repository commit.
- Push only when the user explicitly requests a push.
- Commit vertical slices that are self-contained.
- Use Conventional Commit messages.
- Stage only task-local files.
- Leave unrelated dirty changes alone.
- Validate before committing when practical.
