# Vector Databases Benchmarking Visual Plan

This deck uses inline HTML/CSS diagrams only where they add explanatory value.
No generated PNGs are required.

## Visual: Benchmark Harness Topology

- slide: 5
- concept: Fair comparison boundary
- visualType: architecture
- purpose: Show fixed corpus, Voyage embeddings, adapter layer, vector stores, metrics, and report outputs.
- sourcePath: `slides/database-internals/vector-databases-benchmarking/index.html`
- assetPath: inline HTML/CSS
- altText: Not applicable; semantic HTML diagram marked with `data-visual`.
- layoutRisks: Keep store names compact.
- validationNotes: Counted via `data-visual="benchmark topology"`.

## Visual: Retrieval Pipeline

- slide: 10
- concept: Query to evaluated results
- visualType: flow
- purpose: Explain embedding, first-stage retrieval, filtering, reranking, and metric calculation.
- sourcePath: `slides/database-internals/vector-databases-benchmarking/index.html`
- assetPath: inline HTML/CSS
- altText: Not applicable; semantic HTML diagram marked with `data-visual`.
- layoutRisks: Five-stage flow should not crowd code slides.
- validationNotes: Counted via `data-visual="retrieval pipeline"`.

## Visual: Metric Map

- slide: 16
- concept: Quality versus system metrics
- visualType: metric-map
- purpose: Prevent mixing relevance quality, latency, throughput, cost, and correctness in one vague score.
- sourcePath: `slides/database-internals/vector-databases-benchmarking/index.html`
- assetPath: inline HTML/CSS
- altText: Not applicable; semantic HTML diagram marked with `data-visual`.
- layoutRisks: Keep metric names readable.
- validationNotes: Counted via `data-visual="metric map"`.

## Visual: Store Comparison Matrix

- slide: 28
- concept: MongoDB versus vector-first and relational alternatives
- visualType: comparison
- purpose: Compare primary design center, differentiator, and benchmark watchouts.
- sourcePath: `slides/database-internals/vector-databases-benchmarking/index.html`
- assetPath: inline HTML table
- altText: Not applicable; semantic table marked with `data-visual`.
- layoutRisks: Wide table must use compact text.
- validationNotes: Counted via `data-visual="store comparison matrix"`.

## Visual: Filter Selectivity Map

- slide: 33
- concept: Filtered vector search
- visualType: flow
- purpose: Show why tenant/product/date filters are not an afterthought in support-ticket workloads.
- sourcePath: `slides/database-internals/vector-databases-benchmarking/index.html`
- assetPath: inline HTML/CSS
- altText: Not applicable; semantic HTML diagram marked with `data-visual`.
- layoutRisks: Avoid implementation-specific claims beyond source support.
- validationNotes: Counted via `data-visual="filter selectivity map"`.

## Visual: Decision Framework

- slide: 43
- concept: Choosing the right store
- visualType: comparison
- purpose: Map workload conditions to likely store choices.
- sourcePath: `slides/database-internals/vector-databases-benchmarking/index.html`
- assetPath: inline HTML/CSS
- altText: Not applicable; semantic HTML diagram marked with `data-visual`.
- layoutRisks: Keep as guidance, not a universal ranking.
- validationNotes: Counted via `data-visual="decision framework"`.
