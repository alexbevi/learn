# Firecrawl, Databases, and MongoDB Visual Plan

## Visual: Public Playground Screenshot

- slide: 4
- concept: Firecrawl product surface
- visualType: screenshot
- purpose: Show the learner that Firecrawl exposes endpoint families through a public playground UI, not only docs.
- sourcePath: captured from `https://firecrawl.dev/playground` on 2026-05-31
- assetPath: `assets/img/agent-development/firecrawl-databases/firecrawl-playground.jpg`
- altText: "Firecrawl Playground UI showing tabs for Search, Scrape, Parse, Map, and Crawl with a URL input and start scraping button."
- layoutRisks: Keep as a wide screenshot with contained height so it does not crowd explanatory notes.
- validationNotes: Local JPG asset; source is cited on the references slide.

## Visual: Endpoint Map

- slide: 5
- concept: Endpoint selection
- visualType: comparison
- purpose: Compare scrape, batch scrape, map, crawl, search, interact, and agent by source uncertainty and job shape.
- sourcePath: inline HTML in `slides/agent-development/firecrawl-databases/index.html`
- assetPath: none
- altText: "Comparison table mapping Firecrawl endpoints to source knowledge and job shape."
- layoutRisks: Avoid too many columns; use compact endpoint cards instead of a dense table.
- validationNotes: Counted via `data-visual="endpoint map"`.

## Visual: Output Contract

- slide: 6
- concept: Firecrawl acquisition artifact model
- visualType: taxonomy
- purpose: Separate markdown, JSON, metadata, screenshots, links, status codes, and errors from application truth.
- sourcePath: inline HTML
- assetPath: none
- altText: "Taxonomy showing Firecrawl outputs flowing into downstream storage decisions."
- layoutRisks: Keep label text short to avoid overflow.
- validationNotes: Counted via `data-visual="output contract"`.

## Visual: Map Before Crawl

- slide: 9
- concept: Discovery preflight
- visualType: flow
- purpose: Show why URL discovery, filtering, deduplication, and policy checks should happen before expensive content acquisition.
- sourcePath: inline HTML
- assetPath: none
- altText: "Flow from map to filter to batch scrape or crawl."
- layoutRisks: Maintain readable arrows on mobile.
- validationNotes: Counted via `data-visual="map preflight"`.

## Visual: Crawl Lifecycle

- slide: 10
- concept: Async job lifecycle
- visualType: sequence
- purpose: Show submit, queued/running, page events, status polling, completed/failed, and downstream processing.
- sourcePath: inline HTML
- assetPath: none
- altText: "Sequence diagram for a Firecrawl crawl job lifecycle."
- layoutRisks: Keep sequence steps to six lanes or fewer.
- validationNotes: Counted via `data-visual="crawl lifecycle"`.

## Visual: Ingestion Architecture

- slide: 15
- concept: Web-to-RAG pipeline
- visualType: architecture
- purpose: Show Firecrawl at the acquisition boundary and databases after it for durable processing and retrieval.
- sourcePath: inline HTML
- assetPath: none
- altText: "Architecture diagram from source discovery through Firecrawl, storage, embeddings, retrieval, and answer generation."
- layoutRisks: Avoid nested cards; use a horizontal pipeline with role groups.
- validationNotes: Counted via `data-visual="ingestion architecture"`.

## Visual: Database Role Map

- slide: 16
- concept: Storage roles
- visualType: taxonomy
- purpose: Prevent the learner from treating all persistence as one database responsibility.
- sourcePath: inline HTML
- assetPath: none
- altText: "Map of database roles: source inventory, job ledger, raw archive, normalized documents, chunks and embeddings, retrieval, evals, and audit."
- layoutRisks: Use two rows of compact cards.
- validationNotes: Counted via `data-visual="database role map"`.

## Visual: Job Ledger State Machine

- slide: 17
- concept: Operational state
- visualType: state-machine
- purpose: Show why crawls and batch scrapes need durable local state even when Firecrawl provides status endpoints.
- sourcePath: inline HTML
- assetPath: none
- altText: "State machine from requested to queued, running, page received, normalized, indexed, failed, or retried."
- layoutRisks: Keep failure branch visually distinct without crowding.
- validationNotes: Counted via `data-visual="job ledger state"`.

## Visual: Chunk and Embedding Flow

- slide: 20
- concept: Retrieval preparation
- visualType: flow
- purpose: Show source document to chunks to embeddings to vector/hybrid index with traceability back to source versions.
- sourcePath: inline HTML
- assetPath: none
- altText: "Flow from normalized documents into chunks, embeddings, vector index, and retriever."
- layoutRisks: Keep code-like labels short.
- validationNotes: Counted via `data-visual="chunk flow"`.

## Visual: MongoDB Fit Matrix

- slide: 21
- concept: MongoDB strategy
- visualType: comparison
- purpose: Show where MongoDB is strong, where it is possible but not unique, and where other systems may be better.
- sourcePath: inline HTML
- assetPath: none
- altText: "MongoDB fit matrix for document-shaped content, vector search, operational state, object archive, graph reasoning, and analytics."
- layoutRisks: Color coding must remain readable against deck theme.
- validationNotes: Counted via `data-visual="mongodb fit matrix"`.

## Visual: MongoDB Retrieval Architecture

- slide: 23
- concept: Vector, text, and hybrid search
- visualType: architecture
- purpose: Explain how metadata filters, vector search, full-text search, and rank fusion relate to Firecrawl-ingested chunks.
- sourcePath: inline HTML
- assetPath: none
- altText: "Architecture diagram showing document chunks with vectors and metadata feeding vector, full-text, and hybrid retrieval."
- layoutRisks: Avoid over-explaining rank fusion details on the diagram.
- validationNotes: Counted via `data-visual="mongodb retrieval"`.

## Visual: Change Detection Loop

- slide: 24
- concept: Freshness lifecycle
- visualType: state-machine
- purpose: Show monitor or recrawl outputs feeding selective reprocessing and index updates.
- sourcePath: inline HTML
- assetPath: none
- altText: "Loop showing same, new, changed, removed, and error outcomes from monitoring and re-crawling."
- layoutRisks: Loop must fit in a single slide without text overlap.
- validationNotes: Counted via `data-visual="change loop"`.

## Visual: Quality Scorecard

- slide: 25
- concept: Evaluation
- visualType: metric-map
- purpose: Map acquisition success, extraction accuracy, retrieval recall, citation quality, freshness, and cost to test evidence.
- sourcePath: inline HTML
- assetPath: none
- altText: "Quality scorecard mapping pipeline stages to metrics and evidence."
- layoutRisks: Use short metric labels, not paragraph prose.
- validationNotes: Counted via `data-visual="quality scorecard"`.

## Visual: Adoption Blueprint

- slide: 33
- concept: First implementation
- visualType: architecture
- purpose: Give the learner a bounded first project plan that joins Firecrawl and MongoDB responsibilities.
- sourcePath: inline HTML
- assetPath: none
- altText: "Blueprint for a first Firecrawl and MongoDB project with source policy, job ledger, collections, vector search, and eval set."
- layoutRisks: Keep as staged columns; avoid turning it into a wall of implementation tasks.
- validationNotes: Counted via `data-visual="adoption blueprint"`.
