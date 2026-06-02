# Visual Plan

Deck: `slides/agent-development/langchain-langgraph-databases/`

The deck uses deterministic local SVG diagrams and HTML/CSS layout visuals. No generated bitmap images are used. This matches the guidance that generated images should be illustrative and additive rather than slides-in-image-form.

## Visual Inventory

### Slide 4

- Concept: agent loop mechanics
- Visual type: loop / runtime flow
- Purpose: show the repeated model, tool, observation, and state update cycle that sits behind a simple agent invocation.
- Source path: local SVG asset
- Asset path: `assets/img/agent-development/langchain-langgraph-databases/agent-loop.svg`
- Alt text: Agent loop architecture
- Layout risks: diagram must remain readable at 1280x720 and in both themes.
- Validation notes: local asset; not generated; labels are diagram structure, not slide content.

### Slide 5

- Concept: LangChain, LangGraph, and database layers
- Visual type: stack comparison
- Purpose: separate agent harness responsibilities from orchestration runtime responsibilities and database roles.
- Source path: local SVG asset
- Asset path: `assets/img/agent-development/langchain-langgraph-databases/stack.svg`
- Alt text: LangChain, LangGraph, and database stack
- Layout risks: stacked boundaries need enough contrast in light and dark mode.
- Validation notes: local deterministic SVG; useful as conceptual framing.

### Slide 8

- Concept: hidden harness concerns
- Visual type: comparison table
- Purpose: connect tool schemas, context, and middleware to the concrete failures that appear when harness concerns are ignored.
- Source path: inline HTML table
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: table density can overflow if copy expands.
- Validation notes: HTML table, not an image.

### Slide 11

- Concept: LangGraph state flow
- Visual type: state machine / execution boundary diagram
- Purpose: show how explicit graph steps carry and update state across execution boundaries.
- Source path: local SVG asset
- Asset path: `assets/img/agent-development/langchain-langgraph-databases/state-flow.svg`
- Alt text: LangGraph state flow
- Layout risks: text labels should stay legible without becoming a complete slide image.
- Validation notes: local deterministic SVG; diagram adds structure beyond prose.

### Slide 14

- Concept: durability modes and failure semantics
- Visual type: tradeoff table
- Purpose: compare checkpoint write timing tradeoffs across exit, async, and sync modes.
- Source path: inline HTML table
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: table columns should remain readable at slideshow size.
- Validation notes: HTML table, not an image.

### Slide 16

- Concept: database responsibility map
- Visual type: architecture taxonomy
- Purpose: prevent conflating app data, checkpoints, memory, retrieval, queues, audit, and traces.
- Source path: local SVG asset
- Asset path: `assets/img/agent-development/langchain-langgraph-databases/database-map.svg`
- Alt text: Database responsibilities in agent systems
- Layout risks: multiple responsibilities can become visually crowded.
- Validation notes: local deterministic SVG; additive technical map.

### Slide 19

- Concept: short-term versus long-term memory
- Visual type: comparison table
- Purpose: distinguish thread-scoped continuity from durable user/org/application memories.
- Source path: inline HTML table
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: dense table copy; verify no overflow.
- Validation notes: HTML table, not an image.

### Slide 23

- Concept: pragmatic production architecture
- Visual type: architecture grid
- Purpose: map agent runtime, application data, retrieval, checkpointing, queues, audit, and observability into one deployable system view.
- Source path: inline HTML/CSS panels
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: high density; verify slide fit.
- Validation notes: deterministic HTML layout.

### Slide 25

- Concept: common failure modes
- Visual type: diagnostic map
- Purpose: tie agent-system breakage to likely root causes across state, retrieval, side effects, approval, and observability.
- Source path: inline HTML/CSS panels
- Asset path: not applicable
- Alt text: not applicable
- Layout risks: repeated panels can crowd at smaller slide dimensions.
- Validation notes: deterministic HTML layout.

## Validation Notes

- All image visuals are local assets with useful `alt` text.
- The deck has four local SVG diagrams across 28 slides, plus several HTML tables and panel maps.
- The visual cadence is appropriate for a technical deck: roughly one major visual every 4-5 slides, with additional tables where comparisons are the clearest teaching format.
