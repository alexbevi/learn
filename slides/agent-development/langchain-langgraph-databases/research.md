# Agent Development with LangChain and LangGraph: Research Notes

## Refresh Context

- Deck: `slides/agent-development/langchain-langgraph-databases/`
- Refreshed: 2026-06-01
- Audience: developers and technical leaders building production agent systems that need model/tool orchestration, durable state, human review, retrieval, and database-backed reliability.
- Practical anchor: a customer-support operations agent that answers questions, calls business tools, pauses for approval on risky actions, resumes later, remembers scoped context, retrieves knowledge, and records durable side effects.
- Scope: LangChain and LangGraph as the agent harness and orchestration runtime; database roles across application state, checkpoints, memory, retrieval, queues/outbox, audit, and observability.

## Core Narrative

LangChain and LangGraph solve related but different layers of the agent development problem. LangChain gives developers a high-level agent harness: model calls, tool binding, messages, middleware, structured outputs, and invocation patterns. LangGraph gives developers a lower-level orchestration runtime for explicit state, graph control flow, persistence, interrupts, and durable execution.

The deck frames production agent systems as software systems rather than prompt wrappers. The model loop is only one component. A practical agent also needs state boundaries, tool schemas, authorization, retries, checkpointing, memory policies, retrieval quality, human approval, side-effect reliability, and traces.

## Source-Grounded Claims

### LangChain Agent Harness

- Official LangChain agent docs describe agents as systems that use models and tools, with `create_agent` as the high-level construction API.
- The `create_agent` reference describes an agent graph that calls tools in a loop until a stopping condition is met.
- Human-in-the-loop controls are an explicit agent concern and can be integrated into review and approval flows.
- Teaching implication: LangChain is a good starting point when the developer primarily needs model/tool composition and common interfaces, while still allowing runtime concerns such as checkpointers and middleware to be introduced.

Sources: `langchain-agents`, `langchain-create-agent`, `langchain-hitl`

### LangGraph Runtime

- Official LangGraph docs position LangGraph as a runtime for stateful agents and workflows, using explicit graph structure, state, nodes, and edges.
- LangGraph documentation emphasizes durable execution, persistence, interrupts, and resume behavior for long-running or human-reviewed workflows.
- The "Thinking in LangGraph" guide frames graph design as a state-machine modeling exercise where explicit phases and routing matter.
- Teaching implication: LangGraph becomes valuable when control flow is product logic, when failures must resume predictably, or when a user operation spans time, approvals, or multiple systems.

Sources: `langgraph-overview`, `thinking-in-langgraph`, `langgraph-durable-execution`, `langgraph-interrupts`, `langgraph-persistence`

### Databases In Agent Systems

- LangGraph persistence and checkpointer docs distinguish execution state and checkpoint history from application domain truth.
- LangGraph memory docs distinguish short-term and long-term memory patterns.
- MongoDB Vector Search and pgvector provide retrieval/indexing capabilities, but retrieval alone is not equivalent to durable product memory.
- The transactional outbox pattern remains relevant when agent tools trigger side effects because model loops can retry, pause, or partially fail.
- LangSmith observability concepts support tracing agent behavior across model calls, tool calls, retrievers, and nodes.
- Teaching implication: "the database for the agent" is not one thing. Production systems need separate responsibilities for business data, checkpoint state, memory, vector retrieval, queues, audit, and observability.

Sources: `langgraph-checkpointers`, `langgraph-memory`, `mongodb-vector-search`, `pgvector`, `aws-outbox`, `langsmith-observability`

## Version-Sensitive Areas

- LangChain and LangGraph APIs continue to evolve quickly, especially package paths, persistence integrations, and middleware APIs.
- Model provider strings and hosted deployment options are provider-specific and should not be treated as stable examples.
- Checkpointer backend support and setup instructions may change by language and package version.
- Observability and evaluation features in LangSmith can change faster than the conceptual tracing model.

## Practical Guidance

- Start with LangChain when the problem is primarily model/tool composition.
- Move to LangGraph when phases, approvals, durable pause/resume, state inspection, retries, and recovery are product requirements.
- Keep authorization and business invariants outside the model. Expose narrow tools over application data.
- Treat checkpoint stores as execution state, not the source of domain truth.
- Treat vector search as evidence injection, not memory by itself.
- Use idempotent side-effect processing and transactional outbox patterns when tool calls perform durable writes or external actions.
- Trace agent runs at the operation, node, model call, tool call, retriever, and feedback levels.

## Gaps And Caveats

- The deck does not prescribe a single production backend for checkpoints or memory because that choice depends on throughput, retention, compliance, and existing infrastructure.
- The code examples are intentionally small; production code also needs auth, tenant scoping, schema validation, error handling, and observability.
- The deck uses local SVG and HTML diagrams rather than generated bitmap images so labels and structure remain inspectable and editable.
