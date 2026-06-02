# MongoDB WiredTiger Storage Engine Visual Plan

All visuals are deterministic HTML/CSS diagrams embedded in `slides/database-internals/wiredtiger-storage-engine/index.html`. No generated bitmap assets are used.

## Visual Inventory

- Slide 4
  - concept: server, engine, and OS boundary
  - visualType: architecture map
  - purpose: Show how MongoDB operations cross command/query execution, storage engine, filesystem cache, journal, and data-file layers.
  - sourcePath: `slides/database-internals/wiredtiger-storage-engine/index.html`
  - assetPath: none
  - altText: Layered architecture map from MongoDB server semantics through WiredTiger B-trees, cache, eviction, checkpoint, journal, filesystem cache, and data files.
  - layoutRisks: Three-column stack can become dense; keep labels short and use theme variables.
  - validationNotes: Marked with `data-visual`.

- Slide 8
  - concept: B-tree pages and update chains
  - visualType: architecture map
  - purpose: Connect root/internal/leaf pages to row records and local update history.
  - sourcePath: `slides/database-internals/wiredtiger-storage-engine/index.html`
  - assetPath: none
  - altText: WiredTiger B-tree with root, internal, and leaf nodes, rows, keys, values, and update chain versions.
  - layoutRisks: Many small labels; validate desktop readability.
  - validationNotes: Marked with `data-visual`.

- Slide 14
  - concept: WiredTiger cache versus filesystem cache
  - visualType: architecture map
  - purpose: Separate uncompressed engine cache pages from compressed filesystem-cache pages and disk files.
  - sourcePath: `slides/database-internals/wiredtiger-storage-engine/index.html`
  - assetPath: none
  - altText: Storage hierarchy showing MongoDB working memory, WiredTiger internal cache, filesystem cache, and disk files.
  - layoutRisks: Needs enough contrast in light and dark themes.
  - validationNotes: Marked with `data-visual`.

- Slide 18
  - concept: commit, journal, and checkpoint moments
  - visualType: timeline
  - purpose: Teach that engine commit, log durability, client acknowledgement, checkpoint, and recovery are separate moments.
  - sourcePath: `slides/database-internals/wiredtiger-storage-engine/index.html`
  - assetPath: none
  - altText: Timeline from in-memory update through transaction commit, journal persistence, client acknowledgement, checkpoint, and recovery.
  - layoutRisks: Timeline callouts must not overflow.
  - validationNotes: Marked with `data-visual`.

- Slide 21
  - concept: multi-document insert path
  - visualType: data flow
  - purpose: Trace one application batch through server validation, collection B-tree, index B-trees, transaction visibility, journal, and write concern.
  - sourcePath: `slides/database-internals/wiredtiger-storage-engine/index.html`
  - assetPath: none
  - altText: Insert path flow from client batch to collection page mutation, secondary index writes, transaction visibility, journal, and acknowledgement.
  - layoutRisks: Six-column flow is dense; preserve compact card text and arrow spacing.
  - validationNotes: Marked with `data-visual`.

- Slide 34
  - concept: aggregation execution layers
  - visualType: runtime flow
  - purpose: Separate aggregation optimizer, planner, execution engine, storage cursor, WiredTiger cache, and spill paths.
  - sourcePath: `slides/database-internals/wiredtiger-storage-engine/index.html`
  - assetPath: none
  - altText: Aggregation runtime map from pipeline optimization and planning to cursor reads, index traversal, collection fetches, cache behavior, and spills.
  - layoutRisks: Two-lane diagram should keep server and storage responsibilities visually distinct.
  - validationNotes: Marked with `data-visual`.

- Slide 41
  - concept: symptom-to-mechanism diagnostics
  - visualType: diagnostic map
  - purpose: Help learners map operational symptoms to cache, dirty-page, history-store, journal, query-plan, and platform mechanisms.
  - sourcePath: `slides/database-internals/wiredtiger-storage-engine/index.html`
  - assetPath: none
  - altText: Diagnostic map connecting symptoms such as cache pressure, write latency, disk growth, spills, and conflicts to WiredTiger and MongoDB mechanisms.
  - layoutRisks: Diagnostic matrix is information-dense; use concise labels and avoid nested card text.
  - validationNotes: Marked with `data-visual`.

## Visual Quality Notes

- The deck intentionally uses structural diagrams rather than generated images. These visuals are additive because they expose boundaries, data flow, timelines, and diagnostic mappings that prose would make harder to inspect.
- No external images are embedded.
- All custom visuals are in-slide HTML/CSS and marked with `data-visual`.
