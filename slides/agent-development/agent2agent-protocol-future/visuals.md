# Agent2Agent Protocol Visual Plan

All visuals are deterministic HTML/CSS diagrams embedded in `slides/agent-development/agent2agent-protocol-future/index.html`. No generated bitmap assets are used.

## Visual Inventory

- Slide 4
  - concept: custom glue before-state
  - visualType: before/after comparison
  - purpose: Show agent integration as bespoke APIs, tool wrappers, and hidden state before A2A.
  - sourcePath: `slides/agent-development/agent2agent-protocol-future/index.html`
  - assetPath: none
  - altText: Before-state comparison showing custom glue and flattened tool wrappers.
  - layoutRisks: Comparison cards should not imply A2A removes all integration work.
  - validationNotes: Marked with `data-visual`.

- Slide 8
  - concept: protocol layers
  - visualType: architecture map
  - purpose: Separate protocol data model, operations, transport binding, and application semantics.
  - sourcePath: `slides/agent-development/agent2agent-protocol-future/index.html`
  - assetPath: none
  - altText: A2A layers from Agent Card and task model through operations and framework binding.
  - layoutRisks: Keep protocol and application responsibilities distinct.
  - validationNotes: Marked with `data-visual`.

- Slide 11
  - concept: discovery strategy
  - visualType: flow
  - purpose: Show how clients discover Agent Cards and choose remote agents.
  - sourcePath: `slides/agent-development/agent2agent-protocol-future/index.html`
  - assetPath: none
  - altText: Agent discovery flow from registry or known endpoint to Agent Card evaluation and selected remote agent.
  - layoutRisks: Avoid implying a single mandated registry model.
  - validationNotes: Marked with `data-visual`.

- Slide 12
  - concept: request to task lifecycle
  - visualType: runtime flow
  - purpose: Trace a message request into task state, events, artifacts, and completion.
  - sourcePath: `slides/agent-development/agent2agent-protocol-future/index.html`
  - assetPath: none
  - altText: A2A runtime flow from message send to task status events and artifacts.
  - layoutRisks: Six-step flow needs compact labels.
  - validationNotes: Marked with `data-visual`.

- Slide 15
  - concept: polling, streaming, push
  - visualType: comparison matrix
  - purpose: Compare delivery models by connection lifetime and workload shape.
  - sourcePath: `slides/agent-development/agent2agent-protocol-future/index.html`
  - assetPath: none
  - altText: Matrix comparing polling, streaming, and push notification patterns.
  - layoutRisks: Dense table; keep descriptions short.
  - validationNotes: Marked with `data-visual`.

- Slide 18
  - concept: A2A versus MCP
  - visualType: before/after comparison
  - purpose: Show MCP as tool/context access and A2A as peer-agent delegation.
  - sourcePath: `slides/agent-development/agent2agent-protocol-future/index.html`
  - assetPath: none
  - altText: Comparison of MCP tool boundary and A2A agent boundary.
  - layoutRisks: Avoid overstating exclusivity; both can be used together.
  - validationNotes: Marked with `data-visual`.

- Slide 19
  - concept: agent network after-state
  - visualType: architecture map
  - purpose: Show a coordinator delegating to capability-owning remote agents.
  - sourcePath: `slides/agent-development/agent2agent-protocol-future/index.html`
  - assetPath: none
  - altText: Coordinator agent connected to specialist agents through A2A task boundaries.
  - layoutRisks: Keep coordinator and specialist responsibilities visible.
  - validationNotes: Marked with `data-visual`.

- Slide 21
  - concept: moved responsibilities
  - visualType: architecture map
  - purpose: Show that A2A moves responsibilities into registry, auth, task state, artifacts, and observability.
  - sourcePath: `slides/agent-development/agent2agent-protocol-future/index.html`
  - assetPath: none
  - altText: Responsibility map for production A2A adoption.
  - layoutRisks: Do not make A2A look like a magic simplification.
  - validationNotes: Marked with `data-visual`.

- Slide 39
  - concept: boundary decision
  - visualType: decision framework
  - purpose: Help decide whether a boundary should use A2A.
  - sourcePath: `slides/agent-development/agent2agent-protocol-future/index.html`
  - assetPath: none
  - altText: Decision framework for whether to expose or consume an A2A boundary.
  - layoutRisks: Keep yes/no criteria explicit.
  - validationNotes: Marked with `data-visual`.

## Visual Quality Notes

- The visuals teach lifecycle, boundaries, delegation, and decision structure rather than decorative summaries.
- No generated images or external images are embedded.
- All custom visuals are in-slide HTML/CSS and marked with `data-visual`.
