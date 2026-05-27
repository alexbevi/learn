# Agent Memory Systems Visual Plan

## Visual: Memory Layer Map

- slide: 5
- concept: Memory is a layered data system
- visualType: architecture
- purpose: Show runtime state, product truth, long-term memory, retrieval indexes, and governance as separate layers.
- sourcePath: `visuals/agent-development/agent-memory-systems/memory-layer-map.html`
- assetPath: `assets/img/agent-development/agent-memory-systems/memory-layer-map.png`
- altText: Layered architecture showing model runtime, session state, long-term memory, product records, retrieval indexes, and governance.
- layoutRisks: Dense labels must remain large enough for a 16:9 slide.
- validationNotes: Render as PNG and spot check at 1280x720.

## Visual: Memory Taxonomy

- slide: 7
- concept: Memory types and scopes
- visualType: taxonomy
- purpose: Compare working, session, episodic, semantic, procedural, and shared memory by owner and retention.
- sourcePath: `visuals/agent-development/agent-memory-systems/memory-taxonomy.html`
- assetPath: `assets/img/agent-development/agent-memory-systems/memory-taxonomy.png`
- altText: Taxonomy matrix of agent memory types, stored content, scope, and retention.
- layoutRisks: Matrix text must be concise to avoid overflow.
- validationNotes: Use deterministic HTML table.

## Visual: Write Path

- slide: 12
- concept: Memory write pipeline
- visualType: flow
- purpose: Explain extraction, classification, policy, consolidation, persistence, indexing, and trace emission.
- sourcePath: `visuals/agent-development/agent-memory-systems/write-path.html`
- assetPath: `assets/img/agent-development/agent-memory-systems/write-path.png`
- altText: Memory write path from interaction through extraction, policy, consolidation, storage, indexing, and traces.
- layoutRisks: Keep as seven compact stages.
- validationNotes: Verify labels render in PNG.

## Visual: Read Path

- slide: 17
- concept: Memory read and context assembly
- visualType: flow
- purpose: Show how agent input becomes scoped queries, ranked memories, product truth, and bounded prompt context.
- sourcePath: `visuals/agent-development/agent-memory-systems/read-path.html`
- assetPath: `assets/img/agent-development/agent-memory-systems/read-path.png`
- altText: Memory read path showing query planning, retrieval, ranking, policy filtering, and context assembly.
- layoutRisks: Avoid making the final prompt box too text-heavy.
- validationNotes: Verify on local screenshot.

## Visual: Storage Role Map

- slide: 21
- concept: Databases in memory architecture
- visualType: architecture
- purpose: Separate document store, vector index, graph, relational truth, cache, and audit/event log.
- sourcePath: `visuals/agent-development/agent-memory-systems/storage-role-map.html`
- assetPath: `assets/img/agent-development/agent-memory-systems/storage-role-map.png`
- altText: Storage role map showing document, vector, graph, relational, cache, and audit storage responsibilities.
- layoutRisks: Do not imply one database must do all roles.
- validationNotes: Use neutral labels and source-backed claims.

## Visual: Framework And Service Map

- slide: 32
- concept: Framework-native memory versus dedicated memory services
- visualType: comparison
- purpose: Position LangChain/LangGraph, Mastra, LlamaIndex, OpenAI sessions, Mem0, Zep, Letta, Cognee, Memori, and emerging services by memory ownership.
- sourcePath: `visuals/agent-development/agent-memory-systems/framework-service-map.html`
- assetPath: `assets/img/agent-development/agent-memory-systems/framework-service-map.png`
- altText: Comparison map positioning frameworks, memory services, and emerging memory layers by ownership and scope.
- layoutRisks: Many names; use grouped bands.
- validationNotes: Check text does not overflow.

## Visual: Governance Loop

- slide: 38
- concept: Memory governance and lifecycle
- visualType: state-machine
- purpose: Show approval, use, correction, supersession, expiry, deletion, and audit.
- sourcePath: `visuals/agent-development/agent-memory-systems/governance-loop.html`
- assetPath: `assets/img/agent-development/agent-memory-systems/governance-loop.png`
- altText: Governance loop for memory approval, retrieval, correction, expiry, deletion, and auditing.
- layoutRisks: Circular flow must be legible.
- validationNotes: Rendered asset should be clear on a slide.

## Visual: Decision Matrix

- slide: 43
- concept: Choosing a memory strategy
- visualType: comparison
- purpose: Provide a practical framework for choosing framework-native, app-owned, dedicated, or governed shared memory.
- sourcePath: `visuals/agent-development/agent-memory-systems/decision-matrix.html`
- assetPath: `assets/img/agent-development/agent-memory-systems/decision-matrix.png`
- altText: Decision matrix comparing framework-native memory, app-owned memory, dedicated services, and governed shared memory.
- layoutRisks: Matrix should be compact enough for slide use.
- validationNotes: Include concise recommendation row.
