# Visual Plan

Deck: `slides/agent-development/agent-frameworks-harnesses-runtimes/`

This deck uses deterministic in-slide HTML/CSS visuals and tables rather than external images or generated bitmaps. That fits the updated guidance: visuals should be illustrative and additive, not complete slides embedded as images.

## Visual Inventory

### Slide 4

- Concept: layered agentic development stack
- Visual type: stack map
- Purpose: separate experience, harness, runtime, data plane, and operations layers while showing that real products blur these boundaries.
- Source path: inline HTML `.stack-map`
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: row labels need sufficient contrast in both themes.
- Validation notes: deterministic HTML visual.

### Slide 7

- Concept: provider/model API substrate
- Visual type: flow map
- Purpose: show the foundation under agent frameworks: model API, tool schema, provider features, and execution contract.
- Source path: inline HTML `.flow-map`
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: nodes must not wrap into unreadable fragments.
- Validation notes: deterministic HTML visual.

### Slide 18

- Concept: why runtimes exist
- Visual type: lane map
- Purpose: show that real support operations span classification, retrieval, drafting, approval, and execution rather than one model turn.
- Source path: inline HTML `.lane-map`
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: lane cells are compact; validate at 1280x720.
- Validation notes: deterministic HTML visual.

### Slide 22

- Concept: low-code builders as orchestration products
- Visual type: flow map
- Purpose: explain evented triggers, actions, agent nodes, approval, and observability as a workflow, not a toy interface.
- Source path: inline HTML `.flow-map`
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: five-node flow can become dense.
- Validation notes: deterministic HTML visual.

### Slide 26

- Concept: databases as product memory
- Visual type: flow map
- Purpose: show operational records, semantic search, memory, checkpoints, audit, and eval data as separate database responsibilities.
- Source path: inline HTML `.flow-map`
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: conceptual labels should remain distinct from one another.
- Validation notes: deterministic HTML visual.

### Slide 35

- Concept: production release process
- Visual type: four-card operational map
- Purpose: turn traces, datasets, evals, and release gates into a concrete improvement loop.
- Source path: inline HTML `.grid-4`
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: four cards can crowd if copy expands.
- Validation notes: deterministic HTML visual.

### Slide 39

- Concept: realistic support agent architecture
- Visual type: architecture table
- Purpose: synthesize experience, harness, runtime, data, protocol, and operations layers into a concrete system.
- Source path: inline HTML `.wide-table`
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: densest slide; verify no overflow.
- Validation notes: deterministic HTML table visual.

### Slide 41

- Concept: one job per layer
- Visual type: stack map
- Purpose: recap ownership boundaries so learners can place tools correctly.
- Source path: inline HTML `.stack-map`
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: recap row count can crowd.
- Validation notes: deterministic HTML visual.

## Validation Notes

- No local or generated images are used.
- The deck has repeated HTML/CSS visuals roughly every 4-6 slides, plus tables and grids for comparison and decision frameworks.
- Custom in-slide visuals are implemented as shared deck layout primitives rather than raster assets.
