# Visual planning

Use visuals to teach relationships that prose makes hard to inspect. Do not
turn bullet lists into decorated cards and count them as diagrams.

For each major concept, decide whether the learner needs to inspect:

- an architecture boundary or dependency
- a data or runtime flow
- a sequence, lifecycle, or state transition
- a taxonomy or hierarchy
- a comparison across stable axes
- a metric or diagnostic map
- a code-to-runtime mapping

Create or update `visuals.md`. For every planned visual record:

- slide or slide range
- concept and visual type
- teaching purpose
- source path and rendered asset path when applicable
- useful alt text
- layout risks
- validation notes

Prefer deterministic HTML and CSS diagrams with editable labels. If a bitmap is
useful, place its source under `visuals/<topic>/<deck>/` and its rendered PNG
under `assets/img/<topic>/<deck>/`. Generated images should be conceptual and
non-textual. Keep labels, code, arrows, tables, and small text in HTML.

Aim for one meaningful visual every four to six slides and at least one for each
major relationship listed above. Frequency is a warning signal, not a reason to
add filler.

Every local image needs useful alt text. Render the finished deck and inspect
the contact sheet for legibility, repetition, and overflow.
