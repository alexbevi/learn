# Supabase Modern Workloads Visual Plan

All visuals are deterministic HTML/CSS diagrams inside `slides/agent-development/supabase-modern-workloads/index.html`. No generated bitmap assets are used.

## Visual Inventory

- Slide 4
  - concept: before-state backend complexity
  - visualType: flow
  - purpose: Show how a product idea turns into multi-service integration work.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Five-step flow from product idea through service assembly, policy glue, agent stack learning, and slower shipping.
  - layoutRisks: Flow cards must remain readable at desktop width.
  - validationNotes: Marked with `data-visual`.

- Slide 6
  - concept: Supabase stack map
  - visualType: architecture map
  - purpose: Explain Supabase as clients, AI tools, Postgres core, product primitives, and policy/event/extension boundaries.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Three-column Supabase platform map connecting client SDKs, AI tools, Postgres, product primitives, and security/event boundaries.
  - layoutRisks: Card text should stay compact.
  - validationNotes: Marked with `data-visual`.

- Slide 8
  - concept: product flywheel
  - visualType: flow
  - purpose: Show how readable primitives, scaffolds, feedback, examples, and recommendations reinforce each other.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Supabase adoption flywheel as a five-step flow.
  - layoutRisks: Arrow pseudo-elements should not overlap card text.
  - validationNotes: Marked with `data-visual`.

- Slide 13
  - concept: Auth and RLS request path
  - visualType: request flow
  - purpose: Explain how JWT identity, generated APIs, and Postgres policies combine.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Two-row request flow showing browser and server paths through Supabase Auth, generated APIs, and RLS policies.
  - layoutRisks: Rail columns should remain legible.
  - validationNotes: Marked with `data-visual`.

- Slide 15
  - concept: Realtime architecture
  - visualType: architecture map
  - purpose: Connect clients, Realtime service, authorization, Postgres WAL, and trigger broadcast.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Realtime architecture with client subscriptions, Realtime service, authorization, WAL, and trigger broadcast.
  - layoutRisks: Ensure cards do not become too small.
  - validationNotes: Marked with `data-visual`.

- Slide 19
  - concept: CLI workflow
  - visualType: timeline
  - purpose: Show the local development and deployment loop that agents can operate.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Timeline of Supabase CLI commands from init through start, migration, reset, type generation, and deploy.
  - layoutRisks: Six columns need short command labels.
  - validationNotes: Marked with `data-visual`.

- Slide 22
  - concept: agent visibility
  - visualType: flow
  - purpose: Explain why agents can discover and scaffold Supabase projects.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Five-step agent visibility flow covering docs, snippets, inspectable state, MCP, and repeatable scaffolds.
  - layoutRisks: Avoid treating this as a measured ranking claim.
  - validationNotes: Marked with `data-visual`.

- Slide 23
  - concept: agent control loop
  - visualType: architecture map
  - purpose: Show agent intent, repository inspection, MCP or CLI actions, Supabase project state, verification, and patching.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Agent-assisted Supabase development control loop.
  - layoutRisks: Multi-column card layout should remain readable.
  - validationNotes: Marked with `data-visual`.

- Slide 25
  - concept: competitive map
  - visualType: comparison matrix
  - purpose: Compare Supabase, Firebase, database workflow platforms, and MongoDB Atlas by center and wedge.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Matrix comparing platform centers and main wedges for Supabase, Firebase, Neon/PlanetScale, and MongoDB Atlas.
  - layoutRisks: Dense table; checked with Playwright desktop viewport.
  - validationNotes: Marked with `data-visual`.

- Slide 30
  - concept: MongoDB app-backend gap
  - visualType: comparison matrix
  - purpose: Show where Supabase has packaged app-backend answers and where MongoDB often requires custom glue.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Matrix comparing browser-safe data access, integrated auth, and agent scaffoldability between Supabase and MongoDB Atlas.
  - layoutRisks: Keep explanatory text concise.
  - validationNotes: Marked with `data-visual`.

- Slide 32
  - concept: security model comparison
  - visualType: side-by-side flow
  - purpose: Contrast Supabase-style database policy enforcement with common MongoDB application middleware enforcement.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Side-by-side security model showing Supabase JWT to RLS flow and MongoDB JWT to app middleware flow.
  - layoutRisks: The two lanes should be balanced.
  - validationNotes: Marked with `data-visual`.

- Slide 36
  - concept: practical Supabase build
  - visualType: timeline
  - purpose: Walk through a tenant-scoped AI workspace architecture.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Timeline from schema to auth, RLS, storage, Edge Function, and Realtime.
  - layoutRisks: Six cards need concise descriptions.
  - validationNotes: Marked with `data-visual`.

- Slide 40
  - concept: MongoDB App Backend 2.0
  - visualType: architecture map
  - purpose: Propose a document-native app backend architecture for MongoDB.
  - sourcePath: `slides/agent-development/supabase-modern-workloads/index.html`
  - assetPath: none
  - altText: Proposed MongoDB app backend map with client contracts, identity adapters, data plane, policy plane, runtime plane, local dev, and agent development.
  - layoutRisks: Strategic roadmap content can be dense; use three columns.
  - validationNotes: Marked with `data-visual`.
