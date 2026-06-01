# Practical RAG Systems Visual Plan

All visuals are deterministic HTML/CSS in-slide diagrams marked with `data-visual`. No generated bitmap assets are required for this deck.

## Visual Inventory

- Slide 2
  - concept: learning goals
  - visualType: taxonomy
  - purpose: Orient the audience around architecture, use cases, database fit, and rollout.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Four learning-goal cards covering system flow, production use cases, database tradeoffs, and evaluation.
  - layoutRisks: Compact card text must not overflow on narrower screens.
  - validationNotes: Marked with `data-visual`.

- Slide 5
  - concept: reference architecture
  - visualType: architecture map
  - purpose: Show ingestion, retrieval, generation, and evaluation loops as separate responsibilities.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Production RAG architecture with source systems, ingestion, indexes, query planning, answer generation, and feedback loop.
  - layoutRisks: Many nodes; use compact labels and stable grid tracks.
  - validationNotes: Marked with `data-visual`.

- Slide 9
  - concept: support ingestion
  - visualType: data flow
  - purpose: Trace operational sources into chunks, embeddings, and index records.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Support ingestion pipeline from source systems to source ledger, chunks, embeddings, and searchable indexes.
  - layoutRisks: Five-step flow must collapse to one column on mobile.
  - validationNotes: Marked with `data-visual`.

- Slide 12
  - concept: support retrieval
  - visualType: runtime flow
  - purpose: Show query planning, filters, lexical/vector search, reranking, and answer generation.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Hybrid support retrieval path from user question through filters, lexical and vector candidates, reranker, context pack, and cited answer.
  - layoutRisks: Arrows and cards can become cramped; use five columns maximum.
  - validationNotes: Marked with `data-visual`.

- Slide 14
  - concept: support operations loop
  - visualType: state machine
  - purpose: Show how misses and feedback become content and evaluation work.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Operations loop connecting user feedback, failure diagnosis, source fix, benchmark update, and redeploy.
  - layoutRisks: Loop text should remain short.
  - validationNotes: Marked with `data-visual`.

- Slide 17
  - concept: source authority
  - visualType: state machine
  - purpose: Show proposal evidence moving from draft to approved to expired or exception-only.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Source authority states for proposal RAG evidence.
  - layoutRisks: Ensure state colors work in dark and light theme.
  - validationNotes: Marked with `data-visual`.

- Slide 20
  - concept: governed retrieval
  - visualType: flow
  - purpose: Show pre-retrieval filters for approval, disclosure, customer segment, region, and product.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Governed retrieval flow that blocks unauthorized evidence before answer generation.
  - layoutRisks: Filters can become a wall of labels; use grouped cards.
  - validationNotes: Marked with `data-visual`.

- Slide 23
  - concept: retrieval pattern map
  - visualType: taxonomy
  - purpose: Compare dense, lexical, structured, hybrid, graph, and reranked retrieval patterns.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Retrieval pattern cards mapped to query shapes.
  - layoutRisks: Keep descriptions short.
  - validationNotes: Marked with `data-visual`.

- Slide 25
  - concept: hybrid search
  - visualType: data flow
  - purpose: Explain candidate list fusion and reranking.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Hybrid search combines lexical and vector candidate lists through fusion and optional reranking.
  - layoutRisks: Fit side-by-side candidate lists with readable labels.
  - validationNotes: Marked with `data-visual`.

- Slide 29
  - concept: failure modes
  - visualType: diagnostic map
  - purpose: Locate failures across source policy, parsing, chunking, embedding, filters, retrieval, reranking, prompt, and UX.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: RAG failure map by pipeline stage and symptom.
  - layoutRisks: Dense diagnostic content; use a table-like grid.
  - validationNotes: Marked with `data-visual`.

- Slide 30
  - concept: database responsibilities
  - visualType: taxonomy
  - purpose: Show that databases own more than vector indexes in production RAG.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Database roles across source truth, chunks, vectors, filters, workflow state, traces, and eval datasets.
  - layoutRisks: Avoid visual clutter by using role cards.
  - validationNotes: Marked with `data-visual`.

- Slide 36
  - concept: database comparison
  - visualType: comparison matrix
  - purpose: Compare MongoDB, pgvector, vector-first stores, search engines, and local stores on production dimensions.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Matrix comparing database families by source ownership, filtering, hybrid retrieval, operations, and best fit.
  - layoutRisks: Wide table; use compact text and responsive fallback.
  - validationNotes: Marked with `data-visual`.

- Slide 37
  - concept: architecture choices
  - visualType: architecture map
  - purpose: Show one-store, app-database plus search, and dedicated vector tier options.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Three RAG data-plane architectures and when each fits.
  - layoutRisks: Three columns should remain legible.
  - validationNotes: Marked with `data-visual`.

- Slide 38
  - concept: evaluation pyramid
  - visualType: metric map
  - purpose: Separate retrieval, context, answer, workflow outcome, and operations metrics.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: Evaluation pyramid from retrieval metrics through business outcomes.
  - layoutRisks: Pyramid labels must stay compact.
  - validationNotes: Marked with `data-visual`.

- Slide 40
  - concept: observability
  - visualType: trace flow
  - purpose: Show what a RAG trace must capture to debug bad answers.
  - sourcePath: `slides/agent-development/practical-rag-systems/index.html`
  - assetPath: none
  - altText: RAG trace fields from query and filters to candidates, prompt context, answer, citations, latency, cost, and feedback.
  - layoutRisks: Flow could be dense; split into two rows if needed.
  - validationNotes: Marked with `data-visual`.
