---
name: presentation-outline
description: Use after presentation-research and before authoring a Learn repository deck; turns research artifacts into a narrative slide plan with learning objectives, slide contracts, source ids, examples, and planned visuals.
---

# Presentation Outline

Convert research into a slide contract before writing HTML.

## Inputs

- `slides/<topic>/<deck>/research.md`
- `slides/<topic>/<deck>/sources.json`
- User intake and practical anchor example

## Workflow

1. Choose practical anchors before outlining.
   - Select one or two concrete workloads, systems, user journeys, incidents,
     migrations, or architecture decisions that will recur throughout the deck.
   - Derive the anchors from user intake and research. If the user did not
     provide one, choose a conservative default that stresses the topic's real
     tradeoffs.
   - Use the anchors repeatedly to explain architecture, mechanisms, code,
     failure modes, operational choices, and product implications.
   - Avoid one-off examples that appear once and then disappear.
   - Record the anchors in the outline summary and reference them in relevant
     `claims.json` slide contracts through the `example` field.

2. Define the narrative arc.
   - Start with the learner problem and practical anchor.
   - Move from concepts to mechanisms to operations to application impact.
   - End with recap, diagnostic checklist, and grouped references.
   - For competitive, vendor, product-strategy, or platform-selection decks,
     define stable comparison axes before creating comparison slides. Use the
     axes consistently so each product is evaluated on the same basis:
     - data model and persistence boundary
     - auth, policy, and end-user authorization model
     - generated API or integration surface
     - local development, migration, and testing loop
     - deployment, runtime, and operational model
     - realtime, events, sync, or workflow primitives
     - AI, vector, retrieval, or agent-tooling fit
     - observability, governance, compliance, and enterprise controls
     - lock-in, portability, migration risk, and ecosystem maturity
   - If a comparison axis does not apply, say why instead of silently skipping
     it.

3. Create or update `claims.json`.
   - Use an array of slide contract objects.
   - Required fields: `slide`, `title`, `objective`, `coreClaim`,
     `sourceIds`, `visual`, `practicalTakeaway`.
   - For substantial technical or strategic decks, also include:
     - `learnerQuestion`: the specific question this slide answers
     - `mechanism`: the concrete API, state path, runtime flow, protocol,
       data model, policy, or decision mechanism that supports the claim
     - `example`: the workload, scenario, code snippet, or artifact that makes
       the claim concrete
     - `counterpoint`: the caveat, constraint, failure mode, tradeoff, or
       competing interpretation the learner should not miss
     - `sourceTreatment`: `sourced`, `inference`, or `mixed`
   - `visual` should be `none`, `taxonomy`, `flow`, `architecture`,
     `state-machine`, `sequence`, `comparison`, `metric-map`, or `code`.
   - Keep inferred claims explicit: if `sourceTreatment` is `inference` or
     `mixed`, name the evidence used and the reasoning step in the slide
     contract.

Example contract:

```json
{
  "slide": 12,
  "title": "Auth and RLS Request Path",
  "objective": "Explain how browser-side access can be safe.",
  "learnerQuestion": "How does the platform keep direct client data access from leaking tenant data?",
  "coreClaim": "JWT identity and database-enforced policies let generated APIs serve browser clients safely when policies are correct.",
  "mechanism": "Client JWT -> generated API -> database role/claims -> row-level policy predicate -> filtered result set.",
  "example": "Membership policy over projects and agent_runs tables.",
  "counterpoint": "Policies can be misconfigured, slow, or bypassed by privileged service-role code.",
  "sourceIds": ["vendor-auth-docs", "vendor-policy-docs"],
  "sourceTreatment": "sourced",
  "visual": "flow",
  "practicalTakeaway": "Treat policy definitions as production application code."
}
```

4. Keep one claim per slide whenever possible.
   - Dense decks can use two supporting points, but avoid mixed-purpose slides.
   - Every technical claim should trace to source ids or be marked as inference.

5. Estimate slide count and duration.
   - Technical deep dives usually need 35-60 slides.
   - Prefer more focused slides over overloaded layouts.

6. Run an adversarial outline review before authoring HTML.
   - Review `claims.json` for:
     - unsupported or weakly sourced claims
     - missing caveats, constraints, lifecycle stage, or version sensitivity
     - slides that say "what" without explaining "why" or "how"
     - slides that are too broad, repetitive, or generic
     - comparison slides with inconsistent axes
     - claims that need code, command, API, state-flow, or failure-mode detail
     - major concepts without an appropriate planned visual
   - Revise `claims.json` before proceeding when issues are found.
   - Record unresolved scope risks in the outline response instead of hiding
     them in later slides.

## Output

- `claims.json` ready for authoring.
- A short outline summary in the response with any unresolved scope risks.
