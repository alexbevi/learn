# Practical RAG Systems Research

Audience: product and solutions teams that need enough technical depth to design, sell, evaluate, and troubleshoot production RAG systems.

Deck frame: RAG is not "put docs in a vector database." It is an evidence delivery system with ingestion, indexing, retrieval, authorization, reranking, generation, citation, evaluation, and operations loops. The deck follows two practical use cases end to end:

1. Support escalation copilot for a B2B SaaS vendor.
2. Proposal, security, and compliance answer engine for a field organization.

## RAG Foundation

Source ids: `lewis-rag-2020`, `langchain-retrieval`, `openai-retrieval`

Claims:

- RAG combines a language model with retrieved external context so answers can use non-parametric knowledge that is fresher, proprietary, or too large to fit in model weights.
- Production RAG is a runtime architecture, not a single database feature. It includes content acquisition, parsing, normalization, chunking, embedding, indexing, query planning, retrieval, reranking, generation, guardrails, citations, observability, and evaluation.
- The valuable product promise is not "semantic search." The promise is governed, contextual answers over source-controlled enterprise knowledge.

Mechanisms and flows:

- Ingestion flow: source connector -> raw archive -> parsed document -> canonical metadata -> chunk records -> embedding job -> search index -> source ledger.
- Query flow: user question -> auth context -> intent classification -> query rewrite/decomposition -> filtered retrieval -> hybrid merge -> rerank -> context packing -> generation -> citation and refusal checks -> telemetry.
- Feedback flow: user rating, failed citation, escalation, missing source, stale source, and low-confidence retrieval should become retraining or indexing work.

Implementation implications:

- Retrieval quality often fails before the LLM sees anything useful. Chunking, metadata, filters, recency, and rank fusion are product features, not plumbing.
- RAG needs an application data model for documents, chunks, source versions, tenants, permissions, answers, traces, evals, and feedback.
- Hosted retrieval APIs can reduce plumbing for common file-search workflows, but product teams still own source policy, permissions, answer UX, and evaluation.

Version-sensitive areas:

- Hosted file search APIs, vector store limits, embedding models, and framework APIs change quickly.
- The core architecture has been stable: retrieve relevant evidence, condition generation on evidence, measure both retrieval and answer behavior.

## Production Use Case 1: Support Escalation Copilot

Source ids: `langchain-retrieval`, `mongodb-vector-search`, `mongodb-hybrid-search`, `pgvector-readme`, `pinecone-search-overview`, `pinecone-filtering`, `voyage-reranker`, `ragas-2023`

Problem:

- Support engineers need to answer high-severity customer issues using product docs, release notes, incident reports, tickets, customer configuration, known bugs, and escalation playbooks.
- The hard cases mix natural language symptoms with exact tokens: error codes, product names, tenant ids, version numbers, log fragments, and dates.

End-to-end flow:

1. Ingest product docs, KB articles, release notes, incident postmortems, resolved tickets, known issues, and customer entitlement/configuration records.
2. Preserve source lineage: source system, URL, version, author, last verified date, product area, severity, customer tier, visibility, and permission scope.
3. Chunk by semantic boundaries and operational units: symptom, cause, workaround, fix version, rollback, command, error code, and linked artifacts.
4. Embed chunks, index exact fields, and maintain per-tenant/customer filters.
5. At query time, detect exact identifiers, time range, product/version, customer, and urgency.
6. Run hybrid retrieval: keyword for exact tokens, vector for paraphrase, filters for tenant/product/version/visibility, reranker for top-k precision.
7. Generate a response with cited evidence, confidence, next action, commands to verify, and escalation conditions.
8. Log misses, stale citations, conflicting docs, and user feedback into an evaluation backlog.

Operational implications:

- Authorization must happen before retrieval or as database-enforced pre-filtering. Post-filtering after vector retrieval risks leakage and recall distortion.
- Freshness matters: a stale workaround can be worse than no answer.
- Good answers often require structured data joins: customer plan, feature flags, deployment region, version, entitlement, and active incidents.
- Reranking is useful when recall is acceptable but the top few results are noisy.

Database implications:

- MongoDB fits when support artifacts are document-shaped, metadata-rich, frequently updated, and already operational in MongoDB; Atlas Vector Search and Search can keep source documents, chunks, metadata, text search, vector search, and product telemetry close.
- pgvector fits when Postgres is already the system of record and relational joins, SQL governance, transactional updates, and operational familiarity matter more than specialized vector-serving features.
- Pinecone, Qdrant, Weaviate, and Milvus fit when vector-serving scale, vector-specific operations, or multi-vector search dominate and a separate app database already owns source truth.
- OpenSearch, Elasticsearch, and Azure AI Search fit when enterprise search, BM25, analyzers, synonym handling, search operations, and hybrid rank pipelines are already central.

Gaps and uncertainties:

- Vendor docs describe capabilities, not workload-specific quality. Teams must benchmark with their own tickets and qrels.
- The best store depends on data ownership, not only vector latency.

## Production Use Case 2: Proposal, Security, and Compliance Answer Engine

Source ids: `langchain-retrieval`, `mongodb-vector-search`, `mongodb-hybrid-search`, `pgvector-readme`, `opensearch-hybrid`, `azure-ai-search-semantic`, `azure-ai-search-hybrid`, `chroma-introduction`, `ragas-2023`

Problem:

- Sales engineers, solution architects, security teams, and legal reviewers need consistent answers to RFPs, security questionnaires, architecture reviews, and compliance requests.
- Inputs include customer questionnaires, prior approved answers, product docs, policy documents, SOC reports, data processing addenda, security controls, roadmap statements, and contract clauses.

End-to-end flow:

1. Ingest controlled sources with approval state: approved answer library, public docs, security policy, internal controls, legal templates, contract clauses, and exception history.
2. Split documents by evidence unit: question-answer pair, control, clause, policy section, product claim, architecture diagram caption, or exception note.
3. Store metadata for approval state, source owner, effective date, customer segment, region, product, compliance framework, and disclosure level.
4. Classify incoming question: factual product answer, security-control mapping, contract clause, roadmap limitation, or "needs human approval."
5. Retrieve using hybrid search plus strict filters: only approved public or customer-specific evidence for auto-answer; internal notes only for reviewer guidance.
6. Generate a draft answer with citations, source owner, confidence, and a red/amber/green review state.
7. Route low-confidence, policy-sensitive, or conflicting answers to human approval; write approved answers back as governed retrieval assets.

Operational implications:

- This use case is less about raw vector scale and more about source authority, approval workflow, permissions, versioning, and auditability.
- Retrieval must surface conflicts instead of letting the model silently choose one source.
- Product teams need a content lifecycle: owner, expiry, revalidation cadence, and downstream answer usage.

Database implications:

- MongoDB can model heterogeneous evidence units, source ledgers, approvals, answer drafts, retrieval traces, and vector-searchable chunks in one document-oriented application model.
- Postgres with pgvector can be strong when answer libraries and approvals are already relational, when SQL reporting and row-level security are decisive, or when vector search is an extension of an existing transactional workflow.
- Azure AI Search, OpenSearch, or Elasticsearch may be the stronger first choice when the organization already uses them as the enterprise search tier and needs rich analyzers, synonym maps, semantic ranking, or search operations.
- Chroma is useful for local prototypes, embedded demos, and smaller self-hosted workflows, but production teams still need a governed system of record and operational controls around it.

Gaps and uncertainties:

- Vendor search features do not solve approval workflow, source ownership, or liability. These are product-system responsibilities.
- RAG evaluation for this use case needs human review for policy correctness, not only automated metrics.

## Retrieval Architecture Patterns

Source ids: `langchain-retrieval`, `mongodb-hybrid-search`, `pinecone-search-overview`, `weaviate-hybrid`, `opensearch-hybrid`, `azure-ai-search-hybrid`, `voyage-reranker`

Claims:

- Dense vector search is strongest for semantic similarity and paraphrase.
- Lexical search is strongest for exact identifiers, product names, error codes, legal terms, and short factual strings.
- Hybrid search improves practical RAG because production questions usually combine both semantic and exact-match signals.
- Reranking is a second-stage precision tool. It is usually applied after a broad candidate retrieval set and before context packing.

Mechanisms:

- Fusion: combine rankings from lexical and vector pipelines using rank fusion or weighted score normalization.
- Pre-filtering: constrain candidate set by tenant, permission, date, product, version, region, document type, or approval state before vector search where possible.
- Reranking: score query-document pairs with a reranker, often after retrieving 25-200 candidates and before sending 5-20 chunks to the LLM.
- Context packing: select evidence with diversity, authority, recency, token budget, and citation coverage.

Implementation implications:

- Hybrid retrieval needs a data model that stores both text fields and vector fields with searchable metadata.
- Score normalization is not portable across systems; treat scores as system-local signals.
- Higher top-k and reranking increase latency and cost. Product teams should decide which workflows deserve the extra precision.

## Database Compare and Contrast

Source ids: `mongodb-vector-search`, `mongodb-hybrid-search`, `pgvector-readme`, `pinecone-search-overview`, `pinecone-filtering`, `weaviate-hybrid`, `qdrant-filtering`, `milvus-multivector-hybrid`, `opensearch-hybrid`, `azure-ai-search-semantic`, `chroma-introduction`

Comparison dimensions:

- System of record: Does the store own the source document and product workflow, or only the vector index?
- Query shape: semantic-only, exact-token-heavy, hybrid, relational, graph-like, multi-vector, or multimodal.
- Filtering and authorization: tenant isolation, role filters, customer-specific documents, legal disclosure states, region, product, and time.
- Freshness: update/delete latency, reindexing, source versioning, and whether stale answers can hurt users.
- Operations: backups, scaling, observability, failover, cost controls, deployment model, and team familiarity.
- Evaluation: support for inspecting hits, scores, source metadata, failed queries, and versioned benchmark runs.

System notes:

- MongoDB Atlas: strong when the application is already document-oriented or MongoDB-backed; combines document model, metadata, aggregation, Atlas Search, and Atlas Vector Search. Watch `$vectorSearch` aggregation constraints, filter performance, index/search-node sizing, and eventual indexing behavior.
- pgvector: strong when Postgres is already the product database and vector search is an extension of relational data. It benefits from SQL, ACID, joins, backups, and governance, but vector scale and tuning are tied to Postgres operations.
- Pinecone: strong managed vector-first option with semantic, full-text, sparse, hybrid, metadata filtering, freshness and cost considerations. Often paired with a separate source-of-truth database.
- Weaviate: vector database with object storage, hybrid search, filters, named vectors, and integrated vectorization patterns.
- Qdrant: vector search engine with payload metadata and payload indexes for performant filtering; useful when filterable vector search and self-hosting are important.
- Milvus: vector database oriented to large-scale ANN and multi-vector hybrid search; useful for scale and specialized vector workloads.
- OpenSearch/Elasticsearch/Azure AI Search: search-engine lineage; strong when lexical search, analyzers, semantic ranking, search operations, and enterprise search integration matter.
- Chroma: excellent for local development, demos, and simpler self-hosted retrieval, but production systems still need governance around source truth, access control, and evaluation.

Inferences:

- "Best vector database" is the wrong first question for product/solutions work. Start with source ownership, filters, freshness, and answer liability, then benchmark retrieval quality and latency.
- MongoDB and Postgres/pgvector often compete because both can be application databases plus retrieval stores. Vector-first systems compete when retrieval serving deserves its own tier.

## Evaluation and Operations

Source ids: `beir-2021`, `ragas-2023`, `voyage-reranker`, `pinecone-search-overview`

Claims:

- Retrieval evaluation and answer evaluation are different. A system can retrieve the right evidence and still answer badly, or answer plausibly from the wrong evidence.
- Offline retrieval metrics such as recall@k, MRR, and nDCG are useful for store, chunking, query, and reranking changes.
- RAG evaluation adds answer dimensions: context relevance, faithfulness to evidence, answer correctness, refusal behavior, citation quality, and user usefulness.
- Production observability needs run-level traces: query, filters, retrieved chunks, scores, rerank results, prompt context, answer, citations, latency, cost, and user outcome.

Implementation implications:

- Build a small gold set from real support escalations or proposal questions before optimizing.
- Keep eval datasets versioned with corpus and index settings.
- Track "no answer" and escalation as valid outputs. A RAG product that refuses correctly is better than one that answers without evidence.
- Retrieval drift can come from source changes, chunking changes, embedding model changes, index settings, and product taxonomy changes.

Version-sensitive areas:

- RAG evaluation frameworks and LLM-as-judge practices are changing quickly.
- Automated evaluation should inform, not replace, human review for policy, legal, security, or customer-impacting answers.
