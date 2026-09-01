"""Executable LangGraph skeleton for a research and ideation assistant.

Search and model calls are deterministic stand-ins so the orchestration can be
tested without credentials. Replace those adapters, not the graph contract.
"""

from __future__ import annotations

import operator
from typing import Annotated, Literal

from langgraph.checkpoint.memory import InMemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, RetryPolicy, Send, interrupt
from typing_extensions import TypedDict


class Finding(TypedDict):
    topic: str
    claim: str
    source_url: str


class ResearchState(TypedDict, total=False):
    brief: str
    topics: list[str]
    findings: Annotated[list[Finding], operator.add]
    ideas: list[str]
    review: dict[str, str]
    final_brief: str


class ResearchTask(TypedDict):
    topic: str


SOURCE_FIXTURES: dict[str, Finding] = {
    "market": {
        "topic": "market",
        "claim": "Teams abandon onboarding when value arrives after setup work.",
        "source_url": "https://example.com/research/time-to-value",
    },
    "users": {
        "topic": "users",
        "claim": "New users need a concrete first success, not a feature tour.",
        "source_url": "https://example.com/research/first-success",
    },
    "risks": {
        "topic": "risks",
        "claim": "Aggressive personalization can collect data before trust exists.",
        "source_url": "https://example.com/research/trust",
    },
}


def plan_research(state: ResearchState) -> dict[str, list[str]]:
    """A production node could ask a model for structured research topics."""
    if not state["brief"].strip():
        raise ValueError("brief must not be empty")
    return {"topics": ["market", "users", "risks"]}


def fan_out_research(state: ResearchState) -> list[Send]:
    """Create one task-specific research invocation for every planned topic."""
    return [Send("research_topic", {"topic": topic}) for topic in state["topics"]]


def research_topic(task: ResearchTask) -> dict[str, list[Finding]]:
    """A production adapter would search, fetch, validate, and normalize sources."""
    finding = SOURCE_FIXTURES[task["topic"]]
    return {"findings": [finding]}


def synthesize_ideas(state: ResearchState) -> dict[str, list[str]]:
    """A production node would pass normalized findings to a structured-output LLM."""
    # Parallel completion order is not guaranteed, so make model input stable.
    findings = sorted(state["findings"], key=lambda item: item["topic"])
    evidence = {item["topic"]: item["claim"] for item in findings}
    return {
        "ideas": [
            f"Guided first win — {evidence['users']}",
            f"Progressive setup — {evidence['market']}",
            f"Trust-first personalization — {evidence['risks']}",
        ]
    }


def review_ideas(
    state: ResearchState,
) -> Command[Literal["review_ideas", "finalize"]]:
    """Pause for an authorized human decision; do no side effects before it."""
    decision = interrupt(
        {
            "question": "Choose an idea or request a revision",
            "ideas": state["ideas"],
            "allowed_actions": ["approve", "revise"],
        }
    )
    if not isinstance(decision, dict) or decision.get("action") not in {
        "approve",
        "revise",
    }:
        raise ValueError("review must contain action=approve or action=revise")

    if decision["action"] == "revise":
        feedback = str(decision.get("feedback", "Make the options more distinct."))
        revised = [f"{idea} (revised: {feedback})" for idea in state["ideas"]]
        return Command(
            update={"ideas": revised, "review": {"action": "revise"}},
            goto="review_ideas",
        )

    selected = str(decision.get("idea", state["ideas"][0]))
    if selected not in state["ideas"]:
        raise ValueError("approved idea must be one of the current ideas")
    return Command(
        update={"review": {"action": "approve", "idea": selected}},
        goto="finalize",
    )


def finalize(state: ResearchState) -> dict[str, str]:
    selected = state["review"]["idea"]
    sources = ", ".join(
        finding["source_url"]
        for finding in sorted(state["findings"], key=lambda item: item["topic"])
    )
    return {
        "final_brief": (
            f"Brief: {state['brief']}\n"
            f"Selected direction: {selected}\n"
            f"Evidence reviewed: {sources}"
        )
    }


def create_graph():
    builder = StateGraph(ResearchState)
    builder.add_node("plan_research", plan_research)
    builder.add_node(
        "research_topic",
        research_topic,
        retry_policy=RetryPolicy(
            max_attempts=3,
            retry_on=ConnectionError,
        ),
    )
    builder.add_node("synthesize_ideas", synthesize_ideas)
    builder.add_node("review_ideas", review_ideas)
    builder.add_node("finalize", finalize)

    builder.add_edge(START, "plan_research")
    builder.add_conditional_edges(
        "plan_research",
        fan_out_research,
        ["research_topic"],
    )
    builder.add_edge("research_topic", "synthesize_ideas")
    builder.add_edge("synthesize_ideas", "review_ideas")
    # review_ideas owns its routes through Command; do not add a normal edge.
    builder.add_edge("finalize", END)
    return builder.compile(checkpointer=InMemorySaver())


def run_demo() -> str:
    graph = create_graph()
    config = {"configurable": {"thread_id": "onboarding-brief-001"}}
    paused = graph.invoke(
        {
            "brief": "Reduce onboarding abandonment for a team analytics product.",
            "findings": [],
        },
        config,
    )
    assert "__interrupt__" in paused

    snapshot = graph.get_state(config)
    selected = snapshot.values["ideas"][0]
    completed = graph.invoke(
        Command(resume={"action": "approve", "idea": selected}),
        config,
    )
    return completed["final_brief"]


if __name__ == "__main__":
    print(run_demo())
