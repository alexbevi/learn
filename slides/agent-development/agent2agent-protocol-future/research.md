# Agent2Agent Protocol Research

Audience: engineers and architects designing agentic workloads that need one agent or agent service to delegate work to another across framework, team, or vendor boundaries.

Practical anchor: a customer operations coordinator that delegates work to specialist support, billing, data, and compliance agents, then tracks long-running task state, progress events, artifacts, and human review.

Core frame: A2A solves the boundary problem between independently built agents. Before A2A, teams usually wrap agents as tools or invent bespoke APIs. After A2A, agents can publish capabilities with Agent Cards and collaborate through task-native messages, status events, artifacts, streaming, polling, and push notification patterns. The protocol standardizes the boundary; it does not design the agent, domain schema, governance model, or business workflow for you.

## Before State

Source ids: `a2a-what-is`, `a2a-key-concepts`

Before-state:

- Agent integrations are often custom HTTP APIs, framework-specific adapters, or tool wrappers.
- Tool wrappers flatten an agent into a single callable function and hide its ability to ask clarifying questions, stream progress, return artifacts, or manage long-running state.
- Each coordinator has to invent discovery, capability description, task correlation, progress events, artifact validation, and interruption semantics.

After-state:

- A2A provides a common protocol boundary for agent discovery, task submission, task state, messages, parts, artifacts, streaming, and async follow-up.

Implementation implications:

- The integration problem moves from bespoke glue to protocol mapping, governance, registries, trust, observability, and adapter implementation.
- A2A is most valuable at service boundaries where the remote agent owns capability and state.

## Protocol Model

Source ids: `a2a-spec`, `a2a-key-concepts`, `a2a-discovery`

Mechanisms and flows:

- Agent Card: published capability and endpoint metadata that lets clients discover what an agent can do.
- Message: conversational payload exchanged between client and agent.
- Part: typed content inside a message, supporting text and other modalities.
- Task: durable unit of delegated work with state.
- Artifact: output produced by a task.
- Extension/capability declarations: allow clients to reason about optional protocol behavior.

Operational implications:

- Workloads need durable task ids, context ids, correlation records, artifact validation, and recovery paths.
- Messages are conversation; artifacts are deliverables.
- Agent Cards become API product metadata and need lifecycle management, documentation, and trust controls.

## Streaming, Async, Push, And Human-In-The-Loop

Source ids: `a2a-streaming`, `a2a-spec`

Mechanisms and flows:

- A2A supports synchronous request/reply, polling, streaming, and asynchronous notification patterns.
- Long-running tasks can produce status updates and artifacts over time.
- Streaming is useful while the client is connected; push notifications are useful when the client cannot hold the connection.

Operational implications:

- Task-native workloads must handle submitted, working, input-required, completed, failed, canceled, rejected, and related interrupted states rather than only success/failure.
- Human approval and slow external work should be represented as task state and follow-up messages, not hidden inside one blocking model call.

## A2A And MCP Boundary

Source ids: `a2a-mcp`

Findings:

- MCP is oriented around tools, resources, and context that an agent can use.
- A2A is oriented around peer agents that can receive delegated work and return messages, status, and artifacts.

Implementation implications:

- A production agent may use MCP internally to access tools while exposing A2A externally to collaborate with other agents.
- Do not wrap every tool as an A2A agent or every agent as an MCP tool; choose the boundary based on ownership, autonomy, and task lifecycle.

## Framework Support And Adapters

Source ids: `google-adk-a2a`, `langchain-a2a`, `crewai-a2a`, `mastra-a2a`, `microsoft-agent-framework-a2a`, `a2a-python-sdk`, `a2a-js-sdk`

Findings:

- Framework support exists but is uneven. Some frameworks expose A2A endpoints, some provide remote-agent wrappers, and others require custom mapping.
- LangChain/LangSmith Agent Server documents an A2A endpoint and context/thread mapping.
- Google ADK documents local and remote agent patterns for A2A.
- Microsoft Agent Framework documents A2A agent integration and continuation behavior.
- CrewAI and Mastra document A2A support in their ecosystems.

Implementation implications:

- Every framework must bridge similar concepts: input message, runtime state, task id, context id, streaming events, artifacts, cancellation, auth, and tracing.
- A2A adoption is often a wrapping exercise first, then a governance and observability exercise.

## Production Adoption

Source ids: `a2a-spec`, `a2a-discovery`, `a2a-streaming`, `langchain-a2a`, `microsoft-agent-framework-a2a`

Before-state:

- A coordinator prompt hardcodes specialists and retry logic.

After-state:

- A coordinator can use discovery/registry metadata, select remote agents by capability, create tasks, stream progress, receive artifacts, and preserve durable correlation.

Operational implications:

- Production A2A agents need auth, authorization, rate limits, schema contracts, artifact validation, audit logs, tracing, durable task storage, cancellation handling, and registry lifecycle.
- Agent networks fail differently than single-agent apps: stale Agent Cards, unavailable agents, partial artifacts, task timeouts, duplicated delegation, and policy conflicts.

Open questions and source gaps:

- A2A is still evolving quickly, and framework support changes frequently.
- Source docs describe protocol shape and framework support, but workload-specific governance, identity, and trust architecture remain application responsibilities.
