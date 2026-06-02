# MongoDB Driver SDAM and Server Selection Visual Plan

All visuals are deterministic HTML/CSS diagrams embedded in `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`. No generated bitmap assets are used.

## Visual Inventory

- Slide 3
  - concept: moving distributed system
  - visualType: architecture map
  - purpose: Show drivers mediating between application operations and changing replica set, sharded, or load-balanced deployments.
  - sourcePath: `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`
  - assetPath: none
  - altText: Architecture map showing application, driver state machine, replica set, sharded cluster, and load-balanced deployment boundaries.
  - layoutRisks: Keep deployment categories distinct.
  - validationNotes: Marked with `data-visual`.

- Slide 5
  - concept: local topology map
  - visualType: architecture map
  - purpose: Explain TopologyDescription and ServerDescription as the driver's eventually fresh local view.
  - sourcePath: `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`
  - assetPath: none
  - altText: Driver local topology map with server descriptions, RTT, tags, errors, and topology type.
  - layoutRisks: Dense state labels must remain readable.
  - validationNotes: Marked with `data-visual`.

- Slide 7
  - concept: topology state machine
  - visualType: state machine
  - purpose: Show transitions from unknown topology through replica set, sharded, single, and load-balanced states.
  - sourcePath: `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`
  - assetPath: none
  - altText: SDAM topology state machine narrowing unknown deployment state into known topology types.
  - layoutRisks: State labels should not imply impossible direct transitions.
  - validationNotes: Marked with `data-visual`.

- Slide 8
  - concept: heartbeat loop
  - visualType: flow
  - purpose: Trace background monitoring from heartbeat send to hello response, description update, RTT recording, and waiting operation wakeup.
  - sourcePath: `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`
  - assetPath: none
  - altText: Heartbeat monitoring loop updating server and topology descriptions.
  - layoutRisks: Arrow flow should not overlap card text.
  - validationNotes: Marked with `data-visual`.

- Slide 10
  - concept: seed discovery
  - visualType: flow
  - purpose: Show a seed list expanding to discovered replica set members.
  - sourcePath: `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`
  - assetPath: none
  - altText: Seed host list leading to hello responses and discovered replica set hosts.
  - layoutRisks: Avoid implying seeds are always permanent targets.
  - validationNotes: Marked with `data-visual`.

- Slide 14
  - concept: server selection flow
  - visualType: runtime flow
  - purpose: Show operation type, topology, read preference, tags, staleness, latency window, pinning, and selected server.
  - sourcePath: `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`
  - assetPath: none
  - altText: Server selection flow from operation through filters to selected server.
  - layoutRisks: Many filters; keep each step compact.
  - validationNotes: Marked with `data-visual`.

- Slide 17
  - concept: read routing policy
  - visualType: architecture map
  - purpose: Show how read preference modes route reads to primary, secondaries, or nearest eligible members.
  - sourcePath: `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`
  - assetPath: none
  - altText: Read preference modes mapped to eligible primary and secondary members.
  - layoutRisks: Ensure modes are not confused with consistency guarantees.
  - validationNotes: Marked with `data-visual`.

- Slide 21
  - concept: timeout path
  - visualType: flow
  - purpose: Separate server selection, pool checkout, connection, socket, operation timeout, and server-side max time.
  - sourcePath: `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`
  - assetPath: none
  - altText: Operation path showing distinct timeout budgets before and during command execution.
  - layoutRisks: Timeout names are long; use compact code labels.
  - validationNotes: Marked with `data-visual`.

- Slide 26
  - concept: network errors mutate topology
  - visualType: flow
  - purpose: Show current operation failure updating server description, clearing pool, waking waiters, and retrying eligible work.
  - sourcePath: `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`
  - assetPath: none
  - altText: Failure flow from network error to topology mutation, pool clear, server selection retry, and observable event.
  - layoutRisks: Keep causal path clear.
  - validationNotes: Marked with `data-visual`.

- Slide 30
  - concept: sharded routing
  - visualType: architecture map
  - purpose: Separate driver selection of mongos from mongos selection of shards.
  - sourcePath: `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`
  - assetPath: none
  - altText: Driver chooses mongos routers while mongos routes operations to shards.
  - layoutRisks: Do not imply drivers target shards directly.
  - validationNotes: Marked with `data-visual`.

- Slide 39
  - concept: observe, decide, recover
  - visualType: architecture map
  - purpose: Summarize the driver's hidden state machine.
  - sourcePath: `slides/database-internals/mongodb-driver-sdam-server-selection/index.html`
  - assetPath: none
  - altText: Three-part model of driver behavior: observe topology, decide selected server, recover after failure.
  - layoutRisks: Recap visual should remain simple.
  - validationNotes: Marked with `data-visual`.

## Visual Quality Notes

- These visuals teach state, routing, and timeout boundaries rather than restyling bullet lists.
- No generated images or external images are embedded.
- All custom visuals are in-slide HTML/CSS and marked with `data-visual`.
