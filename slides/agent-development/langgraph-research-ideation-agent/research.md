# Building a Research and Ideation Agent with LangGraph: Research Notes

## Learning Contract

- Deck: `slides/agent-development/langgraph-research-ideation-agent/`
- Researched: 2026-09-01
- Audience: Python developers with intermediate agent familiarity who want to design and operate custom LangGraph workflows.
- Observable outcome: design, implement, trace, test, and critique a production-oriented research and ideation assistant, then decide whether LangGraph is warranted for a new workflow.
- Practical anchor: an assistant that decomposes a brief, fans research out across topics, preserves evidence, synthesizes and critiques ideas, pauses for human selection, and produces a cited brief.
- In scope: Graph API primitives, execution semantics, persistence, interrupts, memory, subgraphs, streaming, failure handling, testing, observability, evaluation, deployment, and framework tradeoffs.
- Out of scope: frontend implementation, model training, search-provider selection, and a full retrieval/citation verification system.

## Version Baseline

- The examples are verified with `langgraph==1.2.11`, released in August 2026.
- The package requires Python 3.10 or newer; the runnable example targets Python 3.11+.
- The deck uses the stable Graph API primitives: `StateGraph`, `START`, `END`, reducers, `Send`, `Command`, `interrupt`, checkpointers, and `RetryPolicy`.
- Node timeouts and node-level error handlers are discussed but marked alpha because the official 1.2 documentation labels them that way.
- Streaming has active versioned protocols. The deck shows the `version="v2"` unified stream format and flags the newer v3 event-streaming layer as version-sensitive rather than teaching it as the default.

## Core Narrative

LangGraph is most useful when an agent's control flow is product logic. A research assistant is a good anchor because it combines model judgment with deterministic orchestration: scope the brief, fan out work, merge evidence, synthesize alternatives, apply critique, obtain a human decision, and finalize an artifact. The graph does not make research true or ideas good. It makes execution boundaries, state transitions, failure recovery, and human intervention explicit.

The lesson grows one graph in four passes:

1. Model the workflow as state, nodes, and routing.
2. Introduce parallel research with `Send` and reducers.
3. Add pause/resume, checkpoints, and idempotent boundaries.
4. Add production evidence: streams, tests, traces, evals, and deployment choices.

## Source-Grounded Findings

### LangGraph's role

- Official docs describe LangGraph as a low-level orchestration framework and runtime for long-running, stateful agents.
- It can mix deterministic Python steps with model-driven steps and does not require LangChain, though LangChain integrations are common.
- LangChain's `create_agent` is built on LangGraph and remains the recommended higher-level starting point for common model/tool loops.
- Teaching implication: the decision is about control and operational requirements, not which product is more capable in the abstract.

Sources: `langgraph-overview`, `langgraph-v1`

### State, updates, reducers, and supersteps

- Graph state can use `TypedDict`, dataclasses, or Pydantic models.
- Nodes read state and return partial updates; they should not mutate shared state in place.
- Each state key has an update rule. Without a reducer, a new value overwrites the old value. With an annotated reducer, concurrent or repeated updates can accumulate.
- Nodes scheduled in the same superstep can execute in parallel. Their update order is not guaranteed, so order-sensitive results need explicit keys and deterministic sorting.
- Teaching implication: state schema design is a concurrency contract, not merely typing.

Sources: `graph-api-concepts`, `graph-api-guide`, `persistence`

### Edges, `Send`, and `Command`

- Static edges define unconditional flow; conditional edges route after a node completes.
- `Send` supports dynamic map-reduce: a routing function creates any number of node invocations with per-task input.
- `Command` combines state updates and control-flow decisions inside a node. Its destination type annotation also supports graph visualization.
- Mixing a normal outgoing edge with dynamic `Command` routing from the same node can schedule both paths; the deck treats that as a diagnosable control-flow bug.
- Teaching implication: use conditional edges for routing that is separable from work; use `Command` when the decision and state update belong to one atomic node result.

Sources: `graph-api-guide`

### Persistence, threads, and recovery

- A checkpointer saves thread-scoped graph state at superstep boundaries. A `thread_id` selects the execution history.
- Per-task pending writes let successful parallel nodes avoid re-execution if a sibling fails in the same superstep.
- A store holds application-defined data across threads; it is not interchangeable with checkpointed graph state.
- Replay resumes from a prior checkpoint; fork creates a new path with modified state. Work after that checkpoint runs again.
- Teaching implication: do not put authoritative business facts or an unbounded evidence corpus into checkpoint state simply because persistence is available.

Sources: `persistence`, `time-travel`, `memory`

### Interrupts and side-effect safety

- `interrupt()` persists state and waits indefinitely for external input; resumption uses `Command(resume=...)` on the same thread.
- A resumed interrupt restarts the entire node from the beginning. Code before the interrupt therefore runs again.
- The interrupt payload must be JSON-serializable; interrupt order must remain stable; the interrupt exception must not be swallowed by `try/except`.
- Teaching implication: place the interrupt before non-idempotent effects, or isolate effects in a later node with an idempotency key.

Sources: `interrupts`, `thinking-in-langgraph`

### Failures and retries

- Retry policies can be configured per node, with exception filters and exponential backoff.
- LLM-correctable errors should become state and loop back; user-correctable errors should interrupt; unexpected programming errors should surface.
- Retry, timeout, and handler behavior composes in a fixed order in the newer fault-tolerance API. Node timeouts and node-level handlers are alpha in the 1.2 docs.
- Teaching implication: retries belong around transient reads, not validation failures or non-idempotent writes.

Sources: `fault-tolerance`, `thinking-in-langgraph`

### Subgraphs, memory, and streaming

- Subgraphs can be per-invocation, per-thread, or stateless. Per-invocation persistence is the default and recommended for independent subagent tasks.
- A checkpointer supplies short-term, thread-scoped memory; a store supplies long-term data across threads.
- Stream modes expose state values, node updates, model messages, custom progress, checkpoint/task events, or debug data.
- Teaching implication: subgraphs are ownership and state-lifetime boundaries. Streaming is a product protocol and an observability surface, not proof of correctness.

Sources: `subgraphs`, `memory`, `streaming`

### Testing, evaluation, observability, and deployment

- Graph tests should create a fresh checkpointer, exercise nodes and routing separately, and use partial execution for selected paths.
- Quality evaluation requires more than final text: research systems need evidence coverage, unsupported-claim rate, source diversity, idea distinctness, and human acceptance signals.
- LangSmith can trace projects, traces, runs, and threads; offline and online evaluation form a feedback loop. It is optional rather than a runtime requirement.
- A deployable LangGraph app typically exposes one or more compiled graphs through `langgraph.json`; LangSmith offers managed, hybrid, standalone, and self-hosted deployment models.
- Teaching implication: an executable graph is the start of production readiness, not the finish.

Sources: `testing`, `observability`, `evaluation`, `evaluate-graph`, `application-structure`, `deployment`

## Tradeoff Synthesis

The following are practitioner inferences from the mechanisms above, not vendor claims:

- LangGraph is a strong fit when pause/resume, recovery, explicit parallelism, human review, and inspectable state are core requirements.
- A LangChain `create_agent` loop is usually cheaper when the behavior is primarily "model chooses a tool until done" and custom phases do not change correctness.
- Plain Python is usually clearer when the workflow is short, deterministic, and can be retried as one unit.
- Graph structure creates a second program to maintain: state schema plus control flow. Poor node boundaries and unconstrained state can make a graph harder to reason about than ordinary code.
- Durability improves recovery only to the last safe boundary. External side effects still need application-level idempotency and reconciliation.
- Explicit control improves auditability but does not guarantee factual research, safe tools, or useful ideas. Those require source validation, authorization, evaluation, and human judgment.

## Teaching Plan

### Act I — See the control problem

Establish the research/ideation workflow and contrast a free-form agent loop with an explicit graph. Define the learning outcome and introduce the recurring run that learners will trace.

### Act II — Build the graph contract

Teach state, nodes, update rules, reducers, edges, `Send`, `Command`, loops, and termination. Use two practice moments: diagnose an invalid concurrent update and predict the control flow created by a mixed edge/`Command` design.

### Act III — Make the run durable

Add interrupt/resume, thread-scoped checkpoints, cross-thread stores, replay/fork, and subgraph persistence. Trace exactly what repeats after a pause or failure and where idempotency belongs.

### Act IV — Operate and choose

Add streaming, failure policy, tests, tracing, evals, deployment, security boundaries, and cost controls. Close with a decision matrix and a reusable design review.

## Practice Contracts

1. **Reducer diagnosis:** predict the result of parallel research nodes updating one list without a reducer; then repair the state contract.
2. **Trace the run:** walk a brief through plan, parallel research, synthesis, interrupt, and resume; identify superstep and checkpoint boundaries.
3. **Failure placement:** decide which failures should retry, loop with state, interrupt, or surface.
4. **Framework choice:** choose plain Python, `create_agent`, or LangGraph for three scenarios and defend the boundary.

## Example Validation

- `examples/research_ideation_graph.py` is a complete Graph API example with deterministic stand-ins for search and model calls.
- `examples/test_research_ideation_graph.py` verifies parallel reduction, pause state, resume behavior, and final output.
- Verification command: `python -m unittest discover -s examples -p 'test_*.py'` in an environment with `langgraph==1.2.11`.
- The deterministic stand-ins make the orchestration testable without credentials; production adapters and quality evals remain separate concerns.

## Gaps and Follow-up Questions

- Search provider, crawl policy, licensing, and citation verification are intentionally left open because they are product and compliance decisions.
- The example uses `InMemorySaver`; production needs a durable checkpointer or Agent Server-managed persistence.
- The deck does not prescribe LangSmith. Equivalent tracing and evaluation can be implemented with other telemetry systems.
- Multi-agent roleplay is not the anchor. Subgraphs appear only where they improve ownership, state lifetime, or independent testing.
