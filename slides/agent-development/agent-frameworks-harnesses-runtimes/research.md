# Agent Frameworks, Harnesses, and Runtimes: Research Notes

## Refresh Context

- Deck: `slides/agent-development/agent-frameworks-harnesses-runtimes/`
- Refreshed: 2026-06-01
- Audience: technical builders and decision-makers comparing agentic development stacks.
- Practical anchor: a support operations agent that needs UI integration, tools, workflow control, memory, retrieval, checkpoints, observability, evaluation, protocols, and durable data.
- Scope: framework taxonomy and workload-fit guidance across model APIs, UI SDKs, harnesses, runtimes, low-code builders, protocols, observability platforms, and database layers.

## Core Narrative

The deck argues that "agent framework" is too broad a label. Agentic systems are made of separable layers: model/provider APIs, UI/application integration, harnesses, runtimes, low-code orchestration, data plane, observability/evals, protocols, and human approval. Products blur these layers, but practitioners need precise names to avoid choosing tools for the wrong job.

The practical decision rule is workload shape. A support operations agent with side effects, approvals, memory, retrieval, release gates, and audit needs more than a prompt loop. It needs each layer to own one clear responsibility.

## Source-Grounded Findings

### Harnesses

- LangChain frames an agent as a model using tools in a loop, with the harness providing model, prompt, tools, context, middleware, and invocation behavior.
- Mastra positions agents as TypeScript product-stack primitives with tools, memory, MCP, logging, tracing, and evals.
- OpenAI Agents SDK, Google ADK, Microsoft Agent Framework, Vercel AI SDK, LlamaIndex, and Agno all expose overlapping but differently packaged agent primitives.
- Teaching implication: the harness is where model/tool calls become product behavior, but it is not necessarily the durable runtime.

Sources: `langchain-js-agents`, `mastra-agents`, `openai-agents-sdk`, `google-adk-overview`, `microsoft-agent-framework`, `vercel-ai-sdk-agents`, `llamaindex-agents`, `agno-docs`

### Runtimes And Workflows

- LangGraph and ADK docs emphasize explicit workflow/state/runtime concepts.
- Mastra workflows and Flowise Agentflow V2 similarly make process steps, control flow, checkpoints, state, and human-in-the-loop behavior visible.
- Vercel AI SDK tool approval and multi-step calling show how UI/application frameworks can still need explicit approval and continuation handling.
- Teaching implication: real work outlives one model call, so state and approval boundaries need runtime support.

Sources: `langgraph-js-overview`, `mastra-workflows`, `google-adk-workflows`, `flowise-agentflow-v2`, `vercel-ai-sdk-tools`

### Low-Code And Visual Builders

- n8n, Langflow, and Flowise are orchestration products that make composition, tool attachment, model provider selection, and workflow state visible.
- Visual builders are not toys; they trade code-level abstraction for inspectable composition and integration speed.
- Teaching implication: low-code versus code is the wrong question. The better question is where logic belongs for the team and workload.

Sources: `n8n-ai-workflow`, `n8n-agent-node`, `langflow-agents`, `flowise-agentflow-v2`

### Data Plane

- MongoDB Vector Search and MongoDB's LangChain integration support vector store, retriever, and hybrid search patterns.
- pgvector supports vector similarity search inside Postgres.
- Mastra RAG and memory docs separate document processing, chunking, embeddings, vector stores, retrieval, message history, working memory, semantic recall, and observational memory.
- Teaching implication: RAG, memory, checkpoints, and product data are different data products, even if one physical database can host several roles.

Sources: `mongodb-vector-search`, `mongodb-langchain`, `pgvector`, `mastra-rag`, `mastra-memory`

### Observability, Evals, Protocols, And Governance

- LangSmith and Langfuse docs show observability and evaluation as repeatable engineering loops around traces, datasets, experiments, scores, and release decisions.
- MCP and A2A provide protocol-level interoperability, but they do not remove ownership of authentication, authorization, data lifecycle, eval quality, or workflow semantics.
- Human approval is a runtime feature because the system must pause, persist, resume, and audit a decision.
- Teaching implication: production agent teams need traces, evals, approvals, protocol boundaries, and release gates as first-class architecture.

Sources: `langsmith-observability`, `langsmith-evaluation`, `langfuse-observability`, `langfuse-evaluation`, `mcp-architecture`, `mcp-spec`, `a2a-spec`

## Version-Sensitive Areas

- Agent frameworks are changing quickly; API names, supported languages, product packaging, and docs URLs can drift.
- ADK, A2A, MCP, Vercel AI SDK, Mastra, Agno, Langfuse, and LangSmith are especially version-sensitive because their product surfaces are actively evolving.
- The deck should use current primary docs and avoid claims that require exact support-matrix freshness unless those claims are checked at refresh time.

## Practical Guidance

- Start from workload shape: UI integration, tool boundary, state lifetime, side-effect risk, memory needs, retrieval depth, protocol exposure, observability, and release process.
- Use model/provider APIs for substrate concerns, not durable product workflows.
- Use UI SDKs when the main problem is frontend streaming and generative UI.
- Use harnesses when the main problem is model/tool composition.
- Use runtimes/workflows when the process must pause, resume, retry, branch, or audit.
- Use visual builders when integration speed and composition visibility matter.
- Treat databases as product infrastructure: operational data, semantic search, memory, checkpoints, audit, and eval datasets are distinct responsibilities.
- Treat protocols as interoperability boundaries, not as replacements for governance.

## Visual Notes

The deck contains no generated bitmap images. Visual teaching aids are inline HTML/CSS structures: stack maps, flow maps, lane maps, tables, grids, and architecture summaries. This is appropriate for the updated visual guidance because the visuals clarify relationships and decision boundaries rather than acting as slide screenshots.
