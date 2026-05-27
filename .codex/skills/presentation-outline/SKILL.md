---
name: presentation-outline
description: Use after presentation-research and before authoring a Learn repository deck; turns research artifacts into a narrative slide plan with learning objectives, slide contracts, source ids, examples, and planned visuals.
---

# Presentation Outline

Convert research into a slide contract before writing HTML.

## Inputs

- `slides/<topic>/<deck>/research.md`
- `slides/<topic>/<deck>/sources.json`
- User intake and practical anchor example

## Workflow

1. Define the narrative arc.
   - Start with the learner problem and practical anchor.
   - Move from concepts to mechanisms to operations to application impact.
   - End with recap, diagnostic checklist, and grouped references.

2. Create or update `claims.json`.
   - Use an array of slide contract objects.
   - Required fields: `slide`, `title`, `objective`, `coreClaim`,
     `sourceIds`, `visual`, `practicalTakeaway`.
   - `visual` should be `none`, `taxonomy`, `flow`, `architecture`,
     `state-machine`, `sequence`, `comparison`, `metric-map`, or `code`.

3. Keep one claim per slide whenever possible.
   - Dense decks can use two supporting points, but avoid mixed-purpose slides.
   - Every technical claim should trace to source ids or be marked as inference.

4. Estimate slide count and duration.
   - Technical deep dives usually need 35-60 slides.
   - Prefer more focused slides over overloaded layouts.

## Output

- `claims.json` ready for authoring.
- A short outline summary in the response with any unresolved scope risks.
