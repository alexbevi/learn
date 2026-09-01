import unittest

from langgraph.types import Command

from research_ideation_graph import create_graph


class ResearchIdeationGraphTests(unittest.TestCase):
    def setUp(self) -> None:
        self.graph = create_graph()
        self.config = {
            "configurable": {"thread_id": f"test-{self._testMethodName}"}
        }

    def pause_at_review(self):
        result = self.graph.invoke(
            {
                "brief": "Reduce onboarding abandonment.",
                "findings": [],
            },
            self.config,
        )
        self.assertIn("__interrupt__", result)
        return self.graph.get_state(self.config)

    def test_parallel_research_merges_all_findings(self) -> None:
        snapshot = self.pause_at_review()
        self.assertEqual(snapshot.next, ("review_ideas",))
        self.assertEqual(
            {finding["topic"] for finding in snapshot.values["findings"]},
            {"market", "users", "risks"},
        )
        self.assertEqual(len(snapshot.values["ideas"]), 3)

    def test_approval_resumes_and_finalizes(self) -> None:
        snapshot = self.pause_at_review()
        selected = snapshot.values["ideas"][1]
        result = self.graph.invoke(
            Command(resume={"action": "approve", "idea": selected}),
            self.config,
        )
        self.assertEqual(result["review"]["action"], "approve")
        self.assertIn(selected, result["final_brief"])
        self.assertEqual(self.graph.get_state(self.config).next, ())


if __name__ == "__main__":
    unittest.main()
