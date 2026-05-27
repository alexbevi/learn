# Vector Databases Benchmarking Research

Target deck: `slides/database-internals/vector-databases-benchmarking/`

Retrieved: 2026-05-27

## Concept: Benchmark Workload

Source ids: `beir-benchmark`, `ir-measures`, `voyage-embeddings`, `voyage-reranker`

Extracted claims:

- A vector database comparison is only meaningful when the embedding model, query set, corpus, relevance judgments, filters, and metric definitions are fixed.
- Retrieval metrics such as Recall@k, MRR@k, and nDCG@k measure different failure modes; latency and cost metrics are infrastructure metrics, not relevance metrics.
- Reranking changes the evaluation surface: the first-stage vector store is measured on candidate recall, while the reranker is measured on final ordering quality.

Mechanisms and flows:

- Support/customer-ticket workload: tickets, comments, product area, tenant, severity, timestamps, resolution notes, and labeled queries.
- Queries include semantic issue descriptions plus structured filters such as tenant, date range, product, and priority.
- Gold labels can be ticket ids or relevance grades.

Implementation implications:

- Use the same Voyage embeddings across all stores for fair vector-store comparison.
- Use a fixed ingestion artifact so each adapter loads identical ids, texts, metadata, and vectors.
- Run both unfiltered and filtered queries because support workloads almost always use tenant and product constraints.

Version-sensitive areas:

- Embedding dimensions, reranker models, and store client APIs change. The deck should show harness shape more than pinning one package version.

## Concept: Embeddings And Reranking

Source ids: `voyage-embeddings`, `voyage-reranker`

Extracted claims:

- Embeddings convert text to vectors that can be indexed for similarity search; query/document input type handling matters.
- Rerankers operate after candidate retrieval and can improve final ranking by scoring query-document pairs more directly than vector similarity.

Mechanisms and flows:

- Embed ticket chunks and query strings.
- Retrieve top N candidates from each store.
- Optionally rerank top N to produce top K for answer context.

Implementation implications:

- The benchmark should separate embedding latency, ingest latency, first-stage retrieval latency, reranking latency, and final quality.
- A strong embedding model can mask store differences at small scale; filtered search, updates, scale, and operations expose database differences.

## Concept: MongoDB Atlas Vector Search

Source ids: `mongodb-atlas-vector-search`, `mongodb-hybrid-search`

Extracted claims:

- Atlas Vector Search indexes vector embeddings stored with MongoDB documents and supports vector search as part of MongoDB application data.
- MongoDB also supports hybrid search patterns with Atlas Search and vector search, including score fusion strategies.

Mechanisms and flows:

- Store ticket document, metadata, and embedding together.
- Use a vector index over an embedding path.
- Apply structured filters to keep retrieval inside tenant/product/date boundaries.
- Combine full-text and vector retrieval for support-ticket search where exact product codes, error strings, and invoice ids matter.

Implementation implications:

- MongoDB's differentiator is not only ANN. It is vector search co-located with operational documents, metadata, full-text search, and application queries.
- Benchmark MongoDB on the same relevance/latency metrics as dedicated vector DBs, plus data-model and update-path ergonomics.

## Concept: Dedicated Vector Systems

Source ids: `pinecone-indexes`, `pinecone-filtering`, `weaviate-vector-index`, `weaviate-hybrid-search`, `qdrant-indexing`, `qdrant-filtering`, `milvus-indexing`, `milvus-filtered-search`, `chroma-collections`, `chroma-querying`, `pgvector-github`

Extracted claims:

- Pinecone emphasizes managed vector indexes with metadata filtering.
- Weaviate exposes HNSW, flat, and dynamic vector indexes, hybrid search, and quantization concepts.
- Qdrant exposes HNSW-style vector indexing, payload indexes, filtering, and quantization.
- Milvus exposes vector database capabilities through its core project and SDKs; use official docs or repositories to verify the exact index and filtered-search behavior for the version under test.
- Chroma is useful as an embedded/local developer vector store with collections, metadata, and querying APIs.
- pgvector brings vector types, distance operators, HNSW, IVFFlat, and SQL filtering into Postgres.

Mechanisms and flows:

- Store vector plus metadata.
- Build ANN index or flat index.
- Filter by metadata either before, during, or after vector candidate generation depending on engine and query plan.
- Return candidate ids plus scores and metadata.

Implementation implications:

- Filter selectivity is a first-class benchmark dimension. A store that performs well on unfiltered top-k can behave differently when restricted to a small tenant/product subset.
- Update/delete behavior and index build time matter for support tickets because tickets and comments evolve.
- Chroma is useful for local harness development but should not be treated as a production-equivalent managed service benchmark without caveats.

## Concept: Metrics And Methodology

Source ids: `beir-benchmark`, `ir-measures`

Extracted claims:

- Information retrieval evaluation should define queries, qrels, run files, and metrics explicitly.
- Quality metrics and system metrics should be reported separately.

Mechanisms and flows:

- Quality: Recall@10/50, nDCG@10, MRR@10, precision@k, filtered-recall@k.
- System: p50/p95/p99 latency, QPS under concurrency, ingest throughput, index build time, storage footprint, memory use, cost per million vectors, update lag.
- Correctness: tenant isolation, filter correctness, deterministic ids, duplicate handling, deletion visibility.

Implementation implications:

- Use paired comparisons: same query, same candidates requested, same filters, same embedding model, same machine class when possible.
- Warm and cold runs should be measured separately.
- Cost should include embedding, reranking, database storage/compute, and operational overhead.

## Concept: Compare/Contrast Frame

Source ids: `mongodb-atlas-vector-search`, `pinecone-indexes`, `weaviate-vector-index`, `qdrant-indexing`, `milvus-indexing`, `pgvector-github`, `chroma-collections`

Extracted claims:

- The correct choice is not "best vector DB"; it is the system whose retrieval, filtering, data model, operational profile, and integration boundaries match the workload.
- MongoDB Atlas Vector Search is strongest when support tickets already live in MongoDB or when vector search must compose with operational documents and Atlas Search.
- Dedicated vector databases are strongest when vector retrieval scale, ANN tuning, vector-native operations, or managed vector service ergonomics dominate.
- pgvector is strongest when the application is Postgres-first and vector search can live inside SQL transactions and relational filters.

Gaps and uncertainties:

- Public docs rarely provide apples-to-apples performance numbers. Any performance claims must be produced by the benchmark harness, not inferred from vendor docs.
- The local link checker could not fetch Milvus documentation pages from the current network location, so the source ledger uses official Milvus repositories and the deck treats detailed Milvus index/filter behavior as version-sensitive.
- Managed-service cost and latency depend heavily on tier, region, data size, index config, concurrency, and filter selectivity.
