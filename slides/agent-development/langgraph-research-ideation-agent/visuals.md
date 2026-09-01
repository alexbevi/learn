# Visual Plan

Deck: `slides/agent-development/langgraph-research-ideation-agent/`

All visuals use deterministic HTML/CSS. No bitmap image is needed: the important content is topology, state, timing, and comparison, which remains clearer and more accessible as live slide markup.

## Visual Inventory

### Slide 3 — Anchor system

- Concept: research-to-decision workflow
- Visual type: end-to-end graph
- Purpose: establish the recurring assistant and distinguish deterministic orchestration from model/tool work.
- Implementation: HTML nodes, arrows, fan-out branches, and a human gate; mark with `data-visual`.
- Risk: nine stages can become crowded; use a two-row topology.

### Slide 5 — Runtime mental model

- Concept: graph definition versus runtime execution
- Visual type: split architecture
- Purpose: separate the static topology from dynamic state and supersteps.
- Implementation: two synchronized lanes with state snapshots.
- Risk: keep labels short and use one example state key per boundary.

### Slide 7 — State update algebra

- Concept: reducers under parallel writes
- Visual type: before/after comparison
- Purpose: show why parallel updates conflict without a reducer and merge with one.
- Implementation: two branches writing `findings`, with overwrite/error and `operator.add` outcomes.
- Risk: source code and mechanism should not compete; use minimal code.

### Slide 10 — Control primitives

- Concept: static edge, conditional edge, `Send`, and `Command`
- Visual type: four-way mapping table with miniature topologies
- Purpose: make selection criteria inspectable at a glance.
- Implementation: HTML comparison grid, marked `data-visual`.
- Risk: do not reduce APIs to slogans; include trigger and output for each.

### Slide 12 — Parallel research superstep

- Concept: dynamic fan-out and barrier
- Visual type: execution timeline
- Purpose: show `Send` creating N tasks, unordered completions, reducer merge, and one downstream synthesis.
- Implementation: horizontal superstep lanes.
- Risk: explicitly state that completion order is not stable.

### Slide 15 — Worked run trace

- Concept: state evolution across the anchor graph
- Visual type: trace table
- Purpose: require the learner to predict next node, changed keys, and saved checkpoint.
- Implementation: HTML table with one concealed/revealed answer row using fragments.
- Risk: fit seven rows without tiny type.

### Slide 18 — Interrupt resume semantics

- Concept: node re-execution after resume
- Visual type: temporal sequence
- Purpose: make the idempotency hazard concrete.
- Implementation: first run and resumed run lanes; repeat the review node.
- Risk: visually distinguish restored state from repeated code.

### Slide 20 — Persistence scopes

- Concept: state, checkpointer, store, and source system
- Visual type: scope map
- Purpose: prevent checkpoint state, long-term memory, evidence, and domain truth from collapsing into one database bucket.
- Implementation: nested boundaries and arrows.
- Risk: use explicit lifetimes and ownership labels.

### Slide 22 — Replay versus fork

- Concept: checkpoint history
- Visual type: branching timeline
- Purpose: show which work is reused and which work re-executes.
- Implementation: checkpoint chain with a fork at synthesis.
- Risk: mark model/tool work after the fork as new output.

### Slide 24 — Subgraph decision

- Concept: per-invocation, per-thread, and stateless subgraphs
- Visual type: comparison table
- Purpose: connect state lifetime to research-worker design.
- Implementation: three-column HTML table.
- Risk: do not imply that every node should be a subgraph.

### Slide 26 — Streaming surfaces

- Concept: graph progress versus model tokens
- Visual type: event multiplexing diagram
- Purpose: show `updates`, `messages`, and `custom` serving different UI needs.
- Implementation: graph lane feeding three consumers.
- Risk: mark stream protocol version sensitivity.

### Slide 28 — Failure policy

- Concept: retry, loop, interrupt, or surface
- Visual type: decision matrix
- Purpose: match failure ownership to recovery mechanism.
- Implementation: 2x2 matrix with anchor examples.
- Risk: keep node timeout/error-handler alpha note visible.

### Slide 30 — Evaluation stack

- Concept: unit, integration, trajectory, and production evaluation
- Visual type: layered test pyramid adapted for agents
- Purpose: link deterministic graph correctness to nondeterministic research quality.
- Implementation: HTML layers and metric callouts.
- Risk: avoid implying LLM judges are ground truth.

### Slide 32 — Production topology

- Concept: deployable service boundaries
- Visual type: architecture diagram
- Purpose: place Agent Server or self-hosted runtime, checkpointer, store, tools, sources, tracing, and review UI.
- Implementation: HTML/CSS architecture map.
- Risk: label managed LangSmith as one option, not a requirement.

### Slide 35 — Framework decision

- Concept: plain Python versus `create_agent` versus LangGraph
- Visual type: decision table
- Purpose: make pros, cons, and exit criteria actionable.
- Implementation: three-column HTML table.
- Risk: distinguish inference from sourced API behavior.

## Cadence and Validation

- Fifteen meaningful visuals across 37 slides, with a major mechanism visual in every section.
- The anchor topology reappears in simplified form on trace, interrupt, persistence, and production slides so later reasoning builds on a familiar map.
- Validation must inspect the contact sheet plus slides 3, 7, 12, 15, 18, 20, 28, 32, and 35 at full size.
