window.LEARN_CATALOG = {
  topics: [
    {
      id: "agent-development",
      title: "Agent Development",
      summary:
        "Practical technical presentations about building, operating, and reasoning about agentic software systems.",
    },
  ],
  presentations: [
    {
      id: "langchain-langgraph-databases",
      topicId: "agent-development",
      title: "Agent Development with LangChain and LangGraph",
      subtitle: "Runtime, State, and Databases",
      path: "slides/agent-development/langchain-langgraph-databases/",
      summary:
        "A builder briefing on what LangChain and LangGraph give developers, how agent runtimes handle state and control flow, and where databases belong in production agent systems.",
      covers: [
        "LangChain as an agent harness for model, tool, prompt, middleware, and invocation concerns.",
        "LangGraph as the orchestration runtime for explicit state, durable execution, interrupts, and recovery.",
        "Database roles across application state, graph checkpoints, long-term memory, retrieval, queues, audit trails, and observability.",
      ],
      learningGoals: [
        "Explain when to use LangChain's higher-level agent API and when to model workflows directly in LangGraph.",
        "Map agent execution to state, nodes, tools, interrupts, and checkpoints.",
        "Choose database responsibilities deliberately instead of treating memory, retrieval, and persistence as one bucket.",
      ],
      durationMinutes: 40,
      slideCount: 28,
      tags: [
        { slug: "agent-development", label: "Agent Development" },
        { slug: "agents", label: "Agents" },
        { slug: "langchain", label: "LangChain" },
        { slug: "langgraph", label: "LangGraph" },
        { slug: "python", label: "Python" },
        { slug: "orchestration", label: "Orchestration" },
        { slug: "state-management", label: "State Management" },
        { slug: "durable-execution", label: "Durable Execution" },
        { slug: "databases", label: "Databases" },
        { slug: "persistence", label: "Persistence" },
        { slug: "memory", label: "Memory" },
        { slug: "observability", label: "Observability" },
      ],
    },
    {
      id: "mastra-agent-development",
      topicId: "agent-development",
      title: "Mastra for Agent Development",
      subtitle: "TypeScript Agents Compared with LangChain, LangGraph, and LangSmith",
      path: "slides/agent-development/mastra-agent-development/",
      summary:
        "A code-level introduction to Mastra's TypeScript agent framework using a customer operations agent, grounded against the common primitives and tradeoffs in the LangChain, LangGraph, and LangSmith ecosystem.",
      covers: [
        "Mastra's value proposition for TypeScript teams: agents, tools, workflows, memory, RAG, MCP, observability, and evals in one framework.",
        "A practical customer operations agent that evolves from tool-calling to retrieval, memory, workflows, human approval, and evaluation.",
        "How Mastra maps to LangChain's agent harness, LangGraph's orchestration runtime, and LangSmith's tracing/evaluation platform.",
      ],
      learningGoals: [
        "Build a mental model for Mastra's core primitives and how they compose in TypeScript.",
        "Understand where Mastra competes with, overlaps with, and differs from LangChain, LangGraph, and LangSmith.",
        "Identify when Mastra is a strong default, when LangChain's ecosystem depth is more compelling, and when explicit graph runtimes matter.",
      ],
      durationMinutes: 55,
      slideCount: 35,
      tags: [
        { slug: "agent-development", label: "Agent Development" },
        { slug: "agents", label: "Agents" },
        { slug: "mastra", label: "Mastra" },
        { slug: "typescript", label: "TypeScript" },
        { slug: "langchain", label: "LangChain" },
        { slug: "langgraph", label: "LangGraph" },
        { slug: "langsmith", label: "LangSmith" },
        { slug: "tools", label: "Tools" },
        { slug: "workflows", label: "Workflows" },
        { slug: "memory", label: "Memory" },
        { slug: "rag", label: "RAG" },
        { slug: "observability", label: "Observability" },
      ],
    },
  ],
};
