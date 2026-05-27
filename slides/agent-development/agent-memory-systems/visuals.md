# Agent Memory Systems Visual Plan

Updated: 2026-05-27

This deck intentionally uses native HTML/CSS diagrams instead of generated PNGs.
The previous raster assets were not additive: they duplicated slide content and
existed mostly to satisfy visual cadence. The revised rule for this deck is:
use a visual only when it teaches a relationship, flow, lifecycle, or decision
boundary that prose alone would make harder to follow.

## Visual: Memory Layer Map

- slide: 5
- concept: Memory is a layered data system
- visualType: architecture
- purpose: Show the ownership boundaries between runtime, session state, long-term memory, product truth, retrieval indexes, and governance.
- sourcePath: `slides/agent-development/agent-memory-systems/index.html`
- assetPath: inline HTML/CSS, no PNG asset
- altText: Not applicable; semantic HTML diagram marked with `data-visual`.
- layoutRisks: Grid should remain compact enough to fit without hiding the teaching caption.
- validationNotes: Counted via `data-visual="architecture map"`.

## Visual: Memory Taxonomy

- slide: 7
- concept: Memory types and scopes
- visualType: taxonomy
- purpose: Compare memory type, stored content, scope, and retention in one compact matrix.
- sourcePath: `slides/agent-development/agent-memory-systems/index.html`
- assetPath: inline HTML table, no PNG asset
- altText: Not applicable; semantic HTML table marked with `data-visual`.
- layoutRisks: Text must stay concise enough for a 16:9 slide.
- validationNotes: Counted via `data-visual="taxonomy matrix"`.

## Visual: Write Path

- slide: 12
- concept: Memory write pipeline
- visualType: flow
- purpose: Reveal where memory quality is won or lost: extraction, policy gates, consolidation, persistence, and indexing.
- sourcePath: `slides/agent-development/agent-memory-systems/index.html`
- assetPath: inline HTML/CSS, no PNG asset
- altText: Not applicable; semantic HTML flow marked with `data-visual`.
- layoutRisks: Five-step flow should not wrap labels on desktop.
- validationNotes: Counted via `data-visual="write path flow"`.

## Visual: Read Path

- slide: 17
- concept: Memory read and context assembly
- visualType: flow
- purpose: Show how input becomes scoped queries, ranked candidates, policy-filtered memories, and bounded prompt context.
- sourcePath: `slides/agent-development/agent-memory-systems/index.html`
- assetPath: inline HTML/CSS, no PNG asset
- altText: Not applicable; semantic HTML flow marked with `data-visual`.
- layoutRisks: The diagram should remain explanatory without competing with the next ranking slide.
- validationNotes: Counted via `data-visual="read path flow"`.

## Visual: Storage Role Map

- slide: 21
- concept: Databases in memory architecture
- visualType: architecture
- purpose: Separate product truth, memory records, vector index, graph index, cache, audit, and eval responsibilities.
- sourcePath: `slides/agent-development/agent-memory-systems/index.html`
- assetPath: inline HTML/CSS, no PNG asset
- altText: Not applicable; semantic HTML diagram marked with `data-visual`.
- layoutRisks: Avoid implying all roles must be handled by a single database.
- validationNotes: Counted via `data-visual="storage role map"`.

## Visual: Framework And Service Map

- slide: 32
- concept: Framework-native memory versus dedicated memory services
- visualType: comparison
- purpose: Position tools by memory ownership model: framework-native, dedicated memory, app-owned stores, and emerging layers.
- sourcePath: `slides/agent-development/agent-memory-systems/index.html`
- assetPath: inline HTML/CSS, no PNG asset
- altText: Not applicable; semantic HTML comparison marked with `data-visual`.
- layoutRisks: Tool chips must stay compact.
- validationNotes: Counted via `data-visual="tooling ownership comparison"`.

## Visual: Governance Lifecycle

- slide: 38
- concept: Memory governance and lifecycle
- visualType: lifecycle
- purpose: Show approval, retrieval, use, correction, expiry, and audit as an operational loop.
- sourcePath: `slides/agent-development/agent-memory-systems/index.html`
- assetPath: inline HTML/CSS, no PNG asset
- altText: Not applicable; semantic HTML lifecycle marked with `data-visual`.
- layoutRisks: Lifecycle should support the slide thesis without becoming ornamental.
- validationNotes: Counted via `data-visual="governance lifecycle"`.

## Visual: Decision Matrix

- slide: 43
- concept: Choosing a memory strategy
- visualType: comparison
- purpose: Help choose between framework-native, app-owned database, dedicated service, and governed shared memory strategies.
- sourcePath: `slides/agent-development/agent-memory-systems/index.html`
- assetPath: inline HTML/CSS, no PNG asset
- altText: Not applicable; semantic HTML comparison marked with `data-visual`.
- layoutRisks: Keep decision criteria short enough to scan.
- validationNotes: Counted via `data-visual="strategy decision matrix"`.
