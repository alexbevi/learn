# Agent Memory Systems Research

Target deck: `slides/agent-development/agent-memory-systems/`

Retrieved: 2026-05-27

## Concept: Memory Is A Product Data System

Source ids: `mongodb-agent-memory`, `langchain-memory-overview`, `memory-survey`

Extracted claims:

- Memory is not just chat transcript retention. Sources consistently separate immediate context from persistent stores that support continuity, adaptation, and reuse.
- MongoDB frames agent memory as an external memory management system around the model: encode, store, retrieve, synthesize, and govern.
- LangChain separates thread-scoped short-term memory from cross-thread long-term memory; this maps cleanly to database responsibilities.

Mechanisms and flows:

- Raw interactions are filtered into memory units.
- Memory units need scope, provenance, lifecycle state, and retrieval hints.
- Read paths assemble prompt context from short-term thread state, long-term memories, product records, and retrieved documents.

Implementation implications:

- Treat memory as a data model, not a framework checkbox.
- Use app-owned truth for authoritative business records; use memory for distilled context, preferences, episodes, learned procedures, and recall traces.
- Database choice follows the representation: documents for flexible records, vectors for semantic recall, graph edges for entity/temporal relationships, relational tables for strict identity and constraints.

Version sensitivity:

- Framework APIs are changing quickly. The deck should emphasize boundaries and mechanisms over exact syntax.

Gaps:

- Public docs describe capabilities more than operational quality. Latency, precision, deletion semantics, and eval methods often require implementation-specific testing.

## Concept: Memory Taxonomy And Scope

Source ids: `mongodb-agent-memory`, `langchain-memory-overview`, `mastra-memory`, `letta-stateful-agents`

Extracted claims:

- Common types include working, session/short-term, episodic, semantic, procedural, and shared memory.
- Scope is as important as type: thread, user, account, organization, agent, team, and fleet memory have different privacy and correctness boundaries.
- Letta uses memory blocks as editable context that can be attached to agents and shared; Mastra uses resource and thread identifiers to control memory boundaries.

Mechanisms and flows:

- Working memory holds active task context and structured user details.
- Episodic memory stores events and interactions.
- Semantic memory stores facts and concepts.
- Procedural memory stores instructions, patterns, and learned approaches.
- Shared memory requires governance, tenancy, access control, and provenance.

Implementation implications:

- A memory record needs `subject`, `scope`, `type`, `validFrom`, `validTo`, `confidence`, `source`, and `policy`.
- Global memory should be rare and governed; default isolation should be user/account/thread scoped.

## Concept: Write Path

Source ids: `mongodb-agent-memory`, `langchain-memory-overview`, `mastra-memory`, `openai-agents-js-memory`, `cognee-remember`

Extracted claims:

- Memory writes can happen in the hot path before the user response or in background consolidation.
- Mastra observational memory uses background agents to compress older messages into dense observations.
- OpenAI sandbox memory docs explicitly warn that memory can become stale and should be treated as guidance.

Mechanisms and flows:

- Candidate extraction chooses what is worth remembering.
- Classification assigns type and scope.
- Normalization converts text to structured fields.
- Policy checks reject sensitive or unapproved records.
- Consolidation merges, expires, supersedes, or links records.
- Indexing updates text, vector, graph, and audit indexes.

Implementation implications:

- The write path needs idempotency, deduplication, source attribution, correction handling, deletion support, and traceability.
- Background writes reduce user latency but can lag behind the latest turn.

## Concept: Read Path

Source ids: `zep-memory`, `langchain-memory-overview`, `llamaindex-memory`, `mem0-overview`, `letta-stateful-agents`

Extracted claims:

- Memory retrieval combines recent raw messages with long-term memory because ingestion, summarization, or graph updates may lag.
- LlamaIndex exposes memory through `put` and `get` style interfaces and supports configurable memory classes.
- Zep exposes a Memory API for adding and retrieving memory, while graph APIs support custom retrieval and context string construction.

Mechanisms and flows:

- Query planning decides what memory types are relevant.
- Retrieval uses recency, exact identifiers, semantic similarity, graph traversal, and policy filters.
- Ranking balances relevance, recency, confidence, scope, and safety.
- Context assembly emits bounded memory context with citations and provenance.

Implementation implications:

- Add a memory budget. Prompt payload should include only the memory required for the next decision.
- Make retrieval observable: log selected memory ids, scores, policies, and omissions.

## Concept: Framework-Native Memory

Source ids: `langchain-short-term-memory`, `langchain-memory-overview`, `langchain-deepagents-memory`, `langmem-github`, `mastra-memory`, `llamaindex-memory`, `openai-agents-sessions`

Extracted claims:

- LangGraph/LangChain distinguish thread-level checkpoints from cross-thread stores.
- Deep Agents supports file-backed long-term memory with scoped backends and background consolidation patterns.
- LangMem provides memory tools that can be used in LangGraph apps and should use a persistent DB-backed store in production.
- Mastra combines message history, observational memory, working memory, semantic recall, processors, tracing, and storage providers.
- LlamaIndex memory is customizable through `BaseMemory` or the newer `Memory` class.
- OpenAI Agents SDK sessions maintain conversation history across agent runs; custom sessions can back memory with other datastores.

Implementation implications:

- Framework memory is usually the fastest path to coherent multi-turn behavior.
- It does not remove the need for product truth, governance, deletion, or memory evals.
- If the framework owns the memory write path, teams still need export, audit, and test hooks.

## Concept: Dedicated Memory Services

Source ids: `mem0-overview`, `zep-memory`, `letta-stateful-agents`, `cognee-agent-memory`, `cognee-remember`, `memori-agents`

Extracted claims:

- Mem0 positions itself as a managed memory engine with user, agent, and session memory plus graph memory features.
- Zep positions memory as a temporal knowledge graph and recommends combining graph-derived long-term context with recent raw messages.
- Letta is stateful-agent centered: all state is persisted, important core memories are injected into context, and agents can modify memory through tools.
- Cognee exposes graph memory and session memory through `remember` and an `agent_memory` decorator.
- Memori Labs describes multi-agent memory processing with dual modes and provider configuration.

Implementation implications:

- Dedicated services are useful when memory quality, cross-agent recall, graph modeling, and operational tooling are core differentiators.
- They add integration, lock-in, privacy, cost, and explainability questions.

## Concept: Emerging Layers

Source ids: `rippletide-agent-docs`, `semvec-pypi`, `caura-site`, `memory-survey`

Extracted claims:

- Rippletide is more of a decision runtime than a pure memory service; its product surface emphasizes runtime reinforcement infrastructure between agents and the real world.
- Semvec is an emerging package claiming fixed-size semantic state plus tiered content-aware memory.
- Caura frames the problem as governed shared memory across agent fleets and teams, with emphasis on silos, visibility, and security boundaries.

Implementation implications:

- Treat these as emerging patterns, not settled standards.
- The useful concepts are portable: decision runtime state, constant-cost memory compression, shared memory governance, and fleet visibility.

Confidence:

- Lower than mature docs. Source surfaces are product pages, package pages, or early docs.

## Concept: Evaluation And Operations

Source ids: `memory-survey`, `mastra-memory`, `openai-agents-js-memory`, `zep-memory`, `mongodb-agent-memory`

Extracted claims:

- Memory quality is not one metric. Recall, precision, freshness, contradiction handling, privacy, latency, cost, deletion, and user trust all matter.
- Memory can be stale, wrong, or policy-unsafe. Systems should not treat remembered data as authoritative without validation.

Implementation implications:

- Create datasets from real support/account tasks.
- Evaluate memory writes and memory reads separately.
- Audit memory selections in traces.
- Test correction, deletion, tenant isolation, and memory poisoning scenarios.
