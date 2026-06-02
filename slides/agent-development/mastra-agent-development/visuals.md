# Visual Plan

Deck: `slides/agent-development/mastra-agent-development/`

The deck uses deterministic HTML-authored diagrams rendered to local PNG assets. No generated bitmap images are used. The images are additive technical visuals rather than slide replacements: they show relationships, runtime boundaries, architectural layers, and feedback loops that would be harder to grasp as prose alone.

## Visual Inventory

### Slide 6

- Concept: Mastra versus LangChain ecosystem shape
- Visual type: ecosystem comparison map
- Purpose: show Mastra as a unified TypeScript framework surface and LangChain as a layered ecosystem across LangChain, LangGraph, and LangSmith.
- Source path: `visuals/agent-development/mastra-agent-development/ecosystem-map.html`
- Asset path: `assets/img/agent-development/mastra-agent-development/ecosystem-map.png`
- Alt text: Comparison diagram showing Mastra as a unified TypeScript framework and LangChain as a layered ecosystem with LangChain, LangGraph, and LangSmith.
- Layout risks: labels must remain legible without becoming a full slide screenshot.
- Validation notes: deterministic local visual; appropriate because it clarifies framework/product boundaries.

### Slide 15

- Concept: Mastra memory modes
- Visual type: taxonomy diagram
- Purpose: distinguish thread history, working memory, semantic recall, and observational memory.
- Source path: `visuals/agent-development/mastra-agent-development/memory-modes.html`
- Asset path: `assets/img/agent-development/mastra-agent-development/memory-modes.png`
- Alt text: Diagram of four Mastra memory modes: thread history, working memory, semantic recall, and observational memory.
- Layout risks: memory labels can crowd if diagram text grows.
- Validation notes: deterministic local visual; supports a conceptual taxonomy rather than restyling bullets.

### Slide 18

- Concept: open-ended agent loop versus explicit workflow boundary
- Visual type: two-lane runtime comparison
- Purpose: show when business processes should move from improvisational tool use into ordered workflow steps.
- Source path: `visuals/agent-development/mastra-agent-development/workflow-boundary.html`
- Asset path: `assets/img/agent-development/mastra-agent-development/workflow-boundary.png`
- Alt text: Two-lane diagram contrasting an open-ended agent loop with an ordered workflow runtime for approvals and side effects.
- Layout risks: ensure arrows and labels remain visible in both themes.
- Validation notes: deterministic local visual; teaches a runtime decision boundary.

### Slide 23

- Concept: trace/eval quality loop
- Visual type: feedback loop
- Purpose: connect traces, datasets, scorers, fixes, and release gates into an operational improvement loop.
- Source path: `visuals/agent-development/mastra-agent-development/quality-loop.html`
- Asset path: `assets/img/agent-development/mastra-agent-development/quality-loop.png`
- Alt text: Loop diagram showing traces flowing into datasets, scorers, fixes, and release gates.
- Layout risks: loop should not obscure slide footnote.
- Validation notes: deterministic local visual; clarifies runtime observability and evaluation flow.

### Slide 30

- Concept: production customer operations architecture
- Visual type: architecture matrix
- Purpose: synthesize experience, control plane, data plane, and quality plane responsibilities across either Mastra or LangChain/LangGraph/LangSmith.
- Source path: `visuals/agent-development/mastra-agent-development/production-architecture.html`
- Asset path: `assets/img/agent-development/mastra-agent-development/production-architecture.png`
- Alt text: Architecture matrix for a production support agent across experience, control plane, data plane, and quality plane.
- Layout risks: this is the densest visual; validate at 1280x720 for legibility and overflow.
- Validation notes: deterministic local visual; helps learners see the common architecture beneath framework choice.

## Validation Notes

- Every local image has useful `alt` text.
- Each PNG under `assets/img/agent-development/mastra-agent-development/` has a matching HTML source under `visuals/agent-development/mastra-agent-development/`.
- Visual cadence is acceptable for a 35-slide technical deck: five major diagrams plus several HTML tables and code examples.
- Generated bitmap imagery is intentionally absent because this deck benefits from editable technical diagrams.
