---
name: presentation-visual-plan
description: Use when planning or improving Learn repository deck visuals; produces visuals.md with required diagrams, source locations, rendered asset paths, alt text, and validation notes before HTML authoring.
---

# Presentation Visual Plan

Plan visuals as first-class teaching artifacts.

## Workflow

1. Read the deck outline or existing deck.
2. Create or update `visuals.md` in the deck directory.
3. For each major concept, decide whether it needs a visual:
   - architecture map
   - data flow
   - sequence or lifecycle
   - state machine
   - taxonomy
   - comparison matrix
   - metric or diagnostic map
   - code-to-runtime mapping
4. A visual is only valid if it teaches structure that prose alone would make
   harder to understand.
   - It should clarify a boundary, sequence, dependency, hierarchy, state
     transition, tradeoff, diagnostic path, or runtime/data flow.
   - Do not create visuals that merely restyle the same bullets already on the
     slide.
   - Do not generate images that would have been complete slides themselves.
     Generated bitmap images, when used, should be illustrative and additive;
     labels, code, tables, and small text should be authored in HTML.
   - Prefer diagrams whose labels can be inspected and edited in code.
5. Aim for one visual aid every 4-6 slides.
6. Prefer deterministic HTML/CSS diagrams.
   - Source: `visuals/<topic>/<deck>/<name>.html`
   - Rendered PNG: `assets/img/<topic>/<deck>/<name>.png`
   - Render with `node scripts/render-visuals.mjs`.
7. Use generated bitmap images only for conceptual non-text imagery.
   - Do not rely on generated images for labels, small text, arrows, tables, or
     code.

## `visuals.md` Fields

For each visual include:

- `slide` or slide range
- `concept`
- `visualType`
- `purpose`
- `sourcePath`
- `assetPath`
- `altText`
- `layoutRisks`
- `validationNotes`

## Validation

- Every local `<img>` needs useful alt text.
- Generated PNGs under `assets/img/` should have matching HTML sources under
  `visuals/`.
- Spot check rendered slides locally for overflow and legibility.
